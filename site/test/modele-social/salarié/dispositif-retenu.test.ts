import fc from 'fast-check'
import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const PROPERTY_TEST_TIMEOUT = 30_000

const montant = (engine: Engine<RègleModèleSocial>, règle: string) => {
	const valeur = engine.evaluate(règle).nodeValue

	return typeof valeur === 'number' ? valeur : null
}

type SituationMahoraise = {
	date: string
	seuilEffectif: string
	secteurÉligible: 'oui' | 'non'
	brut: number
}

type Dispositif = 'RGDU' | 'Lodeom'

const règleDu: Record<Dispositif, string> = {
	RGDU: 'salarié . cotisations . exonérations . RGDU',
	Lodeom: 'salarié . cotisations . exonérations . lodeom . montant',
}

const situationMahoraise = ({
	date,
	seuilEffectif,
	secteurÉligible,
	brut,
}: SituationMahoraise) => ({
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

const dispositifRetenu = (engine: Engine<RègleModèleSocial>) => {
	const RGDU = montant(engine, règleDu.RGDU)
	const lodeom = montant(engine, règleDu.Lodeom)

	if (RGDU !== null && RGDU > 0) return 'RGDU'
	if (lodeom !== null && lodeom > 0) return 'Lodeom'

	return 'aucun'
}

describe('Dispositif d’allègement retenu', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('À Mayotte', () => {
		const SmicMahorais = (date: string) =>
			engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					'établissement . commune . département': "'Mayotte'",
					date,
				},
			}).nodeValue as number

		const casMahorais: [
			libellé: string,
			dispositif: Dispositif,
			situation: Omit<SituationMahoraise, 'brut'>,
		][] = [
			[
				'La RGDU s’applique avant l’ouverture du Lodeom, en mars 2026',
				'RGDU',
				{
					date: '03/2026',
					seuilEffectif: 'moins de 5',
					secteurÉligible: 'non',
				},
			],
			[
				'Le Lodeom s’applique à un employeur de moins de 11 salariés',
				'Lodeom',
				{
					date: '08/2026',
					seuilEffectif: 'moins de 5',
					secteurÉligible: 'non',
				},
			],
			[
				'Le Lodeom s’applique à un employeur d’un secteur éligible',
				'Lodeom',
				{
					date: '08/2026',
					seuilEffectif: 'moins de 20',
					secteurÉligible: 'oui',
				},
			],
			[
				'La RGDU s’applique à un employeur ne relevant d’aucun barème Lodeom',
				'RGDU',
				{
					date: '08/2026',
					seuilEffectif: 'moins de 20',
					secteurÉligible: 'non',
				},
			],
		]

		it.each(casMahorais)('%s', (_libellé, dispositif, situation) => {
			const e = engine.setSituation(
				situationMahoraise({ ...situation, brut: 1500 })
			)

			expect(dispositifRetenu(e)).toBe(dispositif)
			expect(
				montant(e, 'salarié . cotisations . exonérations . employeur')
			).toBe(montant(e, règleDu[dispositif]))
		})

		describe('Au-delà de 1,6 Smic, avant l’ouverture du Lodeom', () => {
			it('ne laisse aucun allègement à l’employeur', () => {
				const brut = Math.ceil(1.6 * SmicMahorais('03/2026'))
				const e = engine.setSituation(
					situationMahoraise({
						date: '03/2026',
						seuilEffectif: 'moins de 5',
						secteurÉligible: 'non',
						brut,
					})
				)

				expect(dispositifRetenu(e)).toBe('aucun')
				expect(
					montant(e, 'salarié . cotisations . exonérations . employeur')
				).toBe(0)
			})
		})

		describe('Quel que soit le salaire', () => {
			const brutMahorais = fc.integer({ min: 1450, max: 2600 })
			const configurations = fc.constantFrom(
				{ seuilEffectif: 'moins de 5', secteurÉligible: 'non' as const },
				{ seuilEffectif: 'moins de 20', secteurÉligible: 'non' as const },
				{ seuilEffectif: 'moins de 20', secteurÉligible: 'oui' as const }
			)
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

			const coûtEnRenonçantAuLodeom = (e: Engine<RègleModèleSocial>) =>
				e.evaluate({
					valeur: 'salarié . coût total employeur',
					contexte: {
						'salarié . cotisations . exonérations . lodeom': 'non',
					},
				}).nodeValue as number

			it(
				'l’allègement n’excède jamais les cotisations patronales dues',
				() => {
					fc.assert(
						fc.property(brutMahorais, configurations, (brut, config) => {
							const e = simulation(brut, config)
							const allègement =
								montant(
									e,
									'salarié . cotisations . exonérations . employeur'
								) ?? 0

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
				'le régime retenu est le plus avantageux des deux',
				() => {
					fc.assert(
						fc.property(brutMahorais, configurations, (brut, config) => {
							const e = simulation(brut, config)

							expect(
								montant(e, 'salarié . coût total employeur')
							).toBeLessThanOrEqual(coûtEnRenonçantAuLodeom(e) + 0.01)
						}),
						{ numRuns: 20 }
					)
				},
				PROPERTY_TEST_TIMEOUT
			)
		})
	})
})
