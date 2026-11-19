import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('En contrat d’apprentissage', () => {
	let engine: Engine<RègleModèleSocial>
	let Smic: number
	beforeEach(() => {
		engine = new Engine(rules)
		Smic = engine.evaluate('SMIC').nodeValue as number
	})

	describe('la rémunération minimale', () => {
		describe('la 1ère année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2026',
			}

			it('est de 27% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.27 * Smic)
				)
			})

			it('est de 43% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.43 * Smic)
				)
			})

			it('est de 53% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.53 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('la 2ème année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2025',
			}

			it('est de 39% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.39 * Smic)
				)
			})

			it('est de 51% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.51 * Smic)
				)
			})

			it('est de 61% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.61 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('la 3ème année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2024',
			}

			it('est de 55% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.55 * Smic)
				)
			})

			it('est de 67% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.67 * Smic)
				)
			})

			it('est de 78% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.78 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})

		describe('la 4ème année', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '18/02/2023',
			}

			it('est de 55% du Smic pour les apprenti⋅es de moins de 18 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'moins de 18'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.55 * Smic)
				)
			})

			it('est de 67% du Smic pour les apprenti⋅es de 18 à 20 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.67 * Smic)
				)
			})

			it('est de 78% du Smic pour les apprenti⋅es de 21 à 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'de 21 à 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(0.78 * Smic)
				)
			})

			it('est de 100% du Smic pour les apprenti⋅es de plus de 25 ans', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . âge': "'plus de 25'",
				})

				expect(e).toEvaluate(
					'salarié . contrat . apprentissage . rémunération minimale',
					Math.round(Smic)
				)
			})
		})
	})

	describe('l’année d’exécution du contrat', () => {
		const tauxSelonLaDate = (dateEmbauche: string, date: string) => {
			const e = engine.setSituation({
				date,
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": dateEmbauche,
				'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
			})
			const SmicÀLaDate = e.evaluate('SMIC').nodeValue as number
			const rémunération = e.evaluate(
				'salarié . contrat . apprentissage . rémunération minimale'
			).nodeValue as number

			return Math.round((rémunération / SmicÀLaDate) * 100) / 100
		}

		it.each([
			['01/09/2025', '30/08/2026', 0.43],
			['01/09/2025', '31/08/2026', 0.43],
			['01/09/2025', '01/09/2026', 0.51],
			['01/09/2025', '31/08/2027', 0.51],
			['01/09/2025', '01/09/2027', 0.67],
			['01/03/2027', '28/02/2028', 0.43],
			['01/03/2027', '29/02/2028', 0.43],
			['01/03/2027', '01/03/2028', 0.51],
			['01/03/2027', '28/02/2029', 0.51],
			['01/03/2027', '01/03/2029', 0.67],
			['15/01/2031', '14/01/2032', 0.43],
			['15/01/2031', '15/01/2032', 0.51],
			['15/01/2032', '14/01/2033', 0.43],
			['15/01/2032', '15/01/2033', 0.51],
		])(
			'pour un contrat débuté le %s, au %s, la rémunération minimale est de %s du Smic',
			(dateEmbauche, date, taux) => {
				expect(tauxSelonLaDate(dateEmbauche, date)).toBe(taux)
			}
		)

		it('est encore la 1re année le dernier jour avant la date anniversaire (803 €)', () => {
			const e = engine.setSituation({
				date: '31/08/2026',
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '01/09/2025',
				'salarié . contrat . apprentissage . âge': "'de 18 à 20'",
			})

			expect(e).toEvaluate(
				'salarié . contrat . apprentissage . rémunération minimale',
				803
			)
		})
	})

	describe('l’avertissement de durée maximale du contrat', () => {
		const notificationAffichée = (handicap: 'oui' | 'non', date: string) => {
			const e = engine.setSituation({
				date,
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '01/09/2025',
				'salarié . régimes spécifiques . apprentissage . handicap': handicap,
			})
			const notification =
				handicap === 'non'
					? 'salarié . contrat . apprentissage . ancienneté . durée maximale avec RQTH'
					: 'salarié . contrat . apprentissage . ancienneté . durée maximale sans RQTH'

			return e.evaluate(notification).nodeValue === true
		}

		it.each([
			['non', '31/08/2028', false],
			['non', '01/09/2028', true],
			['oui', '01/09/2028', false],
			['oui', '31/08/2029', false],
			['oui', '01/09/2029', true],
		] as const)(
			'pour un contrat débuté le 01/09/2025, handicap %s, au %s : affiché %s',
			(handicap, date, affichée) => {
				expect(notificationAffichée(handicap, date)).toBe(affichée)
			}
		)
	})

	describe('l’aide à l’embauche', () => {
		describe('pour les entreprises de moins de 250 salarié⋅es', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '08/03/2026',
				'entreprise . salariés . effectif': 249,
			}

			it('est de 5000 € si l’apprenti⋅e prépare un diplôme de niveau 4 ou moins', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 4 ou moins'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					5_000
				)
			})

			it('est de 4500 € si l’apprenti⋅e prépare un diplôme de niveau 5', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 5'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					4_500
				)
			})

			it('est de 2000 € si l’apprenti⋅e prépare un diplôme de niveau 6 ou 7', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 6 ou 7'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					2_000
				)
			})
		})

		describe('pour les entreprises de 250 salarié⋅es ou plus', () => {
			const situation = {
				'salarié . contrat': "'apprentissage'",
				"salarié . contrat . date d'embauche": '08/03/2026',
				'entreprise . salariés . effectif': 250,
				'entreprise . salariés . ratio alternants': '5%',
			}

			it('est de 2000 € si l’apprenti⋅e prépare un diplôme de niveau 4 ou moins', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 4 ou moins'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					2_000
				)
			})

			it('est de 1500 € si l’apprenti⋅e prépare un diplôme de niveau 5', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 5'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					1_500
				)
			})

			it('est de 750 € si l’apprenti⋅e prépare un diplôme de niveau 6 ou 7', () => {
				const e = engine.setSituation({
					...situation,
					'salarié . contrat . apprentissage . diplôme': "'niveau 6 ou 7'",
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					750
				)
			})

			it('est nulle si l’entreprise a moins de 5% d’alternants', () => {
				const e = engine.setSituation({
					...situation,
					'entreprise . salariés . ratio alternants': '4%',
				})

				expect(e).toEvaluate(
					'salarié . coût total employeur . aides . embauche . apprentissage',
					null
				)
			})
		})
	})
})
