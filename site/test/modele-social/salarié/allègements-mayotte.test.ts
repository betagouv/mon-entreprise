import fc from 'fast-check'
import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

/**
 * À Mayotte deux allègements se succèdent : la RGDU depuis le 1er janvier 2026,
 * puis l’exonération Lodeom à partir du 1er juillet 2026. Le Lodeom prime dès
 * qu’il s’applique, et ses bénéficiaires sont les seuls à conserver les taux
 * réduits de maladie et d’allocations familiales.
 *
 * Cette batterie vérifie, pour chaque situation mahoraise : quel dispositif
 * sort, pour quel montant, et avec quels taux de cotisations.
 */

/** Chaque tirage rejoue une simulation complète : la valeur par défaut de 5 s ne
 * suffit pas quand la machine exécute les autres fichiers de test en parallèle. */
const PROPERTY_TEST_TIMEOUT = 30_000

const TAUX_PLEINS = { maladie: 5.8, allocationsFamiliales: 5.4 }
const TAUX_RÉDUITS = { maladie: 3.12, allocationsFamiliales: 3.55 }

type Situation = {
	date: string
	seuilEffectif: string
	secteurÉligible: 'oui' | 'non'
	brut: number
}

const situationMahoraise = ({
	date,
	seuilEffectif,
	secteurÉligible,
	brut,
}: Situation) => ({
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'établissement . commune . département': "'Mayotte'",
	'salarié . contrat . salaire brut': `${brut} €/mois`,
	date,
	'entreprise . salariés . effectif . seuil': `'${seuilEffectif}'`,
	"salarié . cotisations . exonérations . lodeom . secteurs d'activité éligibles":
		secteurÉligible,
	'salarié . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée':
		'non',
	'salarié . cotisations . exonérations . lodeom . zone un . barème innovation et croissance':
		'non',
})

const montant = (engine: Engine<RègleModèleSocial>, règle: string) => {
	const valeur = engine.evaluate(règle).nodeValue

	return typeof valeur === 'number' ? valeur : null
}

/** Lequel des deux dispositifs porte l’allègement affiché à l’usager. */
const dispositifRetenu = (engine: Engine<RègleModèleSocial>) => {
	const RGDU = montant(engine, 'salarié . cotisations . exonérations . RGDU')
	const lodeom = montant(
		engine,
		'salarié . cotisations . exonérations . lodeom . montant'
	)

	if (RGDU !== null && RGDU > 0) return 'RGDU'
	if (lodeom !== null && lodeom > 0) return 'Lodeom'

	return 'aucun'
}

const smicMahorais = (engine: Engine<RègleModèleSocial>, date: string) =>
	engine.evaluate({
		valeur: 'SMIC',
		contexte: {
			'établissement . commune . département': "'Mayotte'",
			date,
		},
	}).nodeValue as number

describe('Allègements de cotisations à Mayotte', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe.each([
		{
			cas: 'avant l’ouverture du Lodeom, la RGDU sort seule',
			date: '03/2026',
			seuilEffectif: 'moins de 5',
			secteurÉligible: 'non' as const,
			dispositif: 'RGDU',
			taux: TAUX_PLEINS,
			montants: [
				[1500, 311.85],
				[1900, 148.58],
			],
		},
		{
			cas: 'Lodeom ouvert, employeur de moins de 11 salariés',
			date: '08/2026',
			seuilEffectif: 'moins de 5',
			secteurÉligible: 'non' as const,
			dispositif: 'Lodeom',
			taux: TAUX_RÉDUITS,
			montants: [
				[1500, 299.4],
				[1900, 371.83],
			],
		},
		{
			cas: 'Lodeom ouvert, employeur d’un secteur éligible',
			date: '08/2026',
			seuilEffectif: 'moins de 20',
			secteurÉligible: 'oui' as const,
			dispositif: 'Lodeom',
			taux: TAUX_RÉDUITS,
			montants: [
				[1500, 299.4],
				[1900, 371.83],
			],
		},
		{
			cas: 'Lodeom ouvert, employeur ne relevant d’aucun barème',
			date: '08/2026',
			seuilEffectif: 'moins de 20',
			secteurÉligible: 'non' as const,
			dispositif: 'RGDU',
			taux: TAUX_PLEINS,
			montants: [
				[1500, 334.65],
				[1900, 171.38],
			],
		},
	])(
		'$cas',
		({ date, seuilEffectif, secteurÉligible, dispositif, taux, montants }) => {
			const situation = (brut: number) =>
				situationMahoraise({ date, seuilEffectif, secteurÉligible, brut })

			it(`retient ${dispositif}`, () => {
				const e = engine.setSituation(situation(1500))

				expect(dispositifRetenu(e)).toBe(dispositif)
			})

			it.each(montants)('allège de %s € à %s € de brut', (brut, attendu) => {
				const e = engine.setSituation(situation(brut))

				expect(
					montant(e, 'salarié . cotisations . exonérations . employeur')
				).toBeCloseTo(attendu, 2)
			})

			it('applique les taux de maladie et d’allocations familiales attendus', () => {
				const e = engine.setSituation(situation(1500))

				expect(e).toEvaluate(
					'salarié . cotisations . maladie . employeur . taux',
					taux.maladie
				)
				expect(e).toEvaluate(
					'salarié . cotisations . allocations familiales . taux',
					taux.allocationsFamiliales
				)
			})
		}
	)

	// Au-delà de 1,6 Smic la RGDU s’éteint ; si le Lodeom n’est pas encore ouvert,
	// il ne reste rien.
	it('n’accorde aucun allègement au-delà de 1,6 Smic avant l’ouverture du Lodeom', () => {
		const brut = Math.ceil(1.6 * smicMahorais(engine, '03/2026'))
		const e = engine.setSituation(
			situationMahoraise({
				date: '03/2026',
				seuilEffectif: 'moins de 5',
				secteurÉligible: 'non',
				brut,
			})
		)

		expect(dispositifRetenu(e)).toBe('aucun')
		expect(montant(e, 'salarié . cotisations . exonérations . employeur')).toBe(
			0
		)
	})

	// Propriétés attendues quel que soit le salaire, vérifiées sur des valeurs
	// tirées au hasard plutôt que sur une poignée de cas choisis.
	describe('Quel que soit le salaire', () => {
		const brutMahorais = fc.integer({ min: 1450, max: 2600 })
		const configurations = fc.constantFrom(
			{ seuilEffectif: 'moins de 5', secteurÉligible: 'non' as const },
			{ seuilEffectif: 'moins de 20', secteurÉligible: 'non' as const },
			{ seuilEffectif: 'moins de 20', secteurÉligible: 'oui' as const }
		)
		// Le moteur Publicodes est réutilisé d’un tirage à l’autre : l’analyse des règles
		// coûte bien plus cher que le calcul lui-même.
		const simulation = (
			brut: number,
			config: { seuilEffectif: string; secteurÉligible: 'oui' | 'non' }
		) =>
			engine.setSituation(
				situationMahoraise({ date: '08/2026', brut, ...config })
			)
		const cotisationsDues = (e: Engine<RègleModèleSocial>) =>
			e.evaluate({
				valeur: 'salarié . cotisations . employeur',
				contexte: {
					'salarié . cotisations . exonérations . employeur': '0 €/mois',
				},
			}).nodeValue as number

		it(
			'l’allègement n’excède jamais les cotisations patronales dues',
			() => {
				fc.assert(
					fc.property(brutMahorais, configurations, (brut, config) => {
						const e = simulation(brut, config)
						const allègement =
							montant(e, 'salarié . cotisations . exonérations . employeur') ??
							0

						expect(allègement).toBeLessThanOrEqual(cotisationsDues(e) + 0.01)
					}),
					{ numRuns: 20 }
				)
			},
			PROPERTY_TEST_TIMEOUT
		)

		it(
			'le coût de l’employeur reste au-dessus du salaire brut',
			() => {
				fc.assert(
					fc.property(brutMahorais, configurations, (brut, config) => {
						const e = simulation(brut, config)

						expect(
							montant(e, 'salarié . coût total employeur')
						).toBeGreaterThanOrEqual(brut)
					}),
					{ numRuns: 20 }
				)
			},
			PROPERTY_TEST_TIMEOUT
		)

		it(
			'les taux réduits sont réservés aux bénéficiaires d’un barème Lodeom',
			() => {
				fc.assert(
					fc.property(brutMahorais, configurations, (brut, config) => {
						const e = simulation(brut, config)
						const bénéficiaire =
							e.evaluate(
								'salarié . cotisations . exonérations . lodeom . barème applicable'
							).nodeValue === true

						expect(e).toEvaluate(
							'salarié . cotisations . maladie . employeur . taux',
							bénéficiaire ? TAUX_RÉDUITS.maladie : TAUX_PLEINS.maladie
						)
					}),
					{ numRuns: 20 }
				)
			},
			PROPERTY_TEST_TIMEOUT
		)

		it(
			'la RGDU décroît quand le salaire augmente',
			() => {
				fc.assert(
					fc.property(
						fc.integer({ min: 1450, max: 2200 }),
						fc.integer({ min: 10, max: 100 }),
						(brut, écart) => {
							const config = {
								seuilEffectif: 'moins de 20',
								secteurÉligible: 'non' as const,
							}
							const coefficient = (b: number) =>
								montant(
									simulation(b, config),
									'salarié . cotisations . exonérations . RGDU . coefficient'
								)
							const bas = coefficient(brut)
							const haut = coefficient(brut + écart)

							if (bas === null || haut === null) return

							expect(haut).toBeLessThanOrEqual(bas)
						}
					),
					{ numRuns: 20 }
				)
			},
			PROPERTY_TEST_TIMEOUT
		)
	})
})
