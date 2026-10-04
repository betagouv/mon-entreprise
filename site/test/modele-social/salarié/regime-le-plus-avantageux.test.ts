import fc from 'fast-check'
import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const PROPERTY_TEST_TIMEOUT = 30_000

const RÉGIMES = 'salarié . cotisations . employeur . régimes'

const montant = (engine: Engine<RègleModèleSocial>, règle: string) => {
	const valeur = engine.evaluate(règle).nodeValue

	return typeof valeur === 'number' ? valeur : null
}

type SituationZoneUn = {
	département: string
	date: string
	seuilEffectif: string
	secteurÉligible: 'oui' | 'non'
	brut: number
}

type SituationMahoraise = Omit<SituationZoneUn, 'département'>

type Régime = 'avec RGDU' | 'avec Lodeom'

const situationZoneUn = ({
	département,
	date,
	seuilEffectif,
	secteurÉligible,
	brut,
}: SituationZoneUn) => ({
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'établissement . commune . département': `'${département}'`,
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

const situationMahoraise = (situation: SituationMahoraise) =>
	situationZoneUn({ ...situation, département: 'Mayotte' })

const régimeLePlusAvantageux = (engine: Engine<RègleModèleSocial>) =>
	engine.evaluate(`${RÉGIMES} . le plus avantageux`).nodeValue

const coûtDuRégime = (engine: Engine<RègleModèleSocial>, régime: string) =>
	montant(engine, `${RÉGIMES} . ${régime}`)

describe('Régime d’exonération le plus avantageux', () => {
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
			régime: Régime,
			situation: Omit<SituationMahoraise, 'brut'>,
		][] = [
			[
				'La RGDU s’applique avant l’ouverture du Lodeom, en mars 2026',
				'avec RGDU',
				{
					date: '03/2026',
					seuilEffectif: 'moins de 5',
					secteurÉligible: 'non',
				},
			],
			[
				'Le Lodeom s’applique à un employeur de moins de 11 salariés',
				'avec Lodeom',
				{
					date: '08/2026',
					seuilEffectif: 'moins de 5',
					secteurÉligible: 'non',
				},
			],
			[
				'Le Lodeom s’applique à un employeur d’un secteur éligible',
				'avec Lodeom',
				{
					date: '08/2026',
					seuilEffectif: 'moins de 20',
					secteurÉligible: 'oui',
				},
			],
			[
				'La RGDU s’applique à un employeur ne relevant d’aucun barème Lodeom',
				'avec RGDU',
				{
					date: '08/2026',
					seuilEffectif: 'moins de 20',
					secteurÉligible: 'non',
				},
			],
		]

		it.each(casMahorais)('%s', (_libellé, régime, situation) => {
			const e = engine.setSituation(
				situationMahoraise({ ...situation, brut: 1500 })
			)

			expect(régimeLePlusAvantageux(e)).toBe(régime)
			expect(montant(e, 'salarié . cotisations . employeur')).toBe(
				coûtDuRégime(e, régime)
			)
		})

		describe('Au-delà de 1,6 Smic, avant l’ouverture du Lodeom', () => {
			it('ne laisse aucun dispositif d’exonération à l’employeur', () => {
				const brut = Math.ceil(1.6 * SmicMahorais('03/2026'))
				const e = engine.setSituation(
					situationMahoraise({
						date: '03/2026',
						seuilEffectif: 'moins de 5',
						secteurÉligible: 'non',
						brut,
					})
				)

				expect(régimeLePlusAvantageux(e)).toBe('sans dispositif')
				expect(montant(e, 'salarié . cotisations . employeur')).toBe(
					coûtDuRégime(e, 'sans dispositif')
				)
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
				montant(e, 'salarié . cotisations . employeur . cotisations dues') ?? 0

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
				'ne coûte jamais plus que de renoncer au Lodeom',
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

			it(
				'désigne un régime dont le coût est celui de l’employeur',
				() => {
					fc.assert(
						fc.property(brutMahorais, configurations, (brut, config) => {
							const e = simulation(brut, config)

							expect(coûtDuRégime(e, régimeLePlusAvantageux(e) as string)).toBe(
								montant(e, 'salarié . cotisations . employeur')
							)
						}),
						{ numRuns: 20 }
					)
				},
				PROPERTY_TEST_TIMEOUT
			)
		})
	})

	describe('En Guadeloupe, au-delà de 2,5 Smic du 31 décembre 2023', () => {
		const situation = situationZoneUn({
			département: 'Guadeloupe',
			date: '08/2026',
			seuilEffectif: 'moins de 5',
			secteurÉligible: 'non',
			brut: 4400,
		})

		it('désigne la RGDU, dont l’exonération dépasse celle du Lodeom épuisée', () => {
			const e = engine.setSituation(situation)

			expect(régimeLePlusAvantageux(e)).toBe('avec RGDU')
		})

		it('fait cotiser l’employeur aux taux pleins, qu’il ne bénéficie plus du Lodeom', () => {
			const e = engine.setSituation(situation)

			expect(e).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				13
			)
			expect(e).toEvaluate(
				'salarié . cotisations . allocations familiales . taux',
				5.25
			)
		})
	})

	describe('Pour une jeune entreprise innovante', () => {
		it('désigne le régime avec JEI', () => {
			const e = engine.setSituation({
				dirigeant: 'non',
				'entreprise . catégorie juridique': "''",
				'entreprise . imposition': 'non',
				'salarié . contrat . salaire brut': '3000 €/mois',
				'salarié . cotisations . exonérations . JEI': 'oui',
				date: '08/2026',
			})

			expect(régimeLePlusAvantageux(e)).toBe('avec JEI')
		})
	})

	describe('Pour un président de SAS qui bénéficie de l’Acre', () => {
		it('désigne le régime avec Acre', () => {
			const e = engine.setSituation({
				'entreprise . catégorie juridique': "'SAS'",
				'entreprise . associés': "'unique'",
				'dirigeant . exonérations . ACRE': 'oui',
				'entreprise . date de création': '01/03/2026',
				'salarié . contrat . salaire brut': '2000 €/mois',
				date: '08/2026',
			})

			expect(régimeLePlusAvantageux(e)).toBe('avec Acre')
		})
	})

	describe('Pour un salarié qui n’est pas dirigeant', () => {
		it('ne compte aucune exonération Acre, même une fois ses cotisations calculées', () => {
			const e = engine.setSituation({
				dirigeant: 'non',
				'entreprise . catégorie juridique': "''",
				'entreprise . imposition': 'non',
				'salarié . contrat . salaire brut': '2000 €/mois',
				date: '08/2026',
			})
			e.evaluate('salarié . cotisations . employeur')

			expect(
				e.evaluate('salarié . cotisations . exonérations . Acre . employeur')
					.nodeValue
			).toBeNull()
		})
	})
})
