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
	})

	describe('l’ancienneté du contrat', () => {
		const ancienneté = (dateEmbauche: string, date: string) =>
			engine
				.setSituation({
					date,
					'salarié . contrat': "'apprentissage'",
					"salarié . contrat . date d'embauche": dateEmbauche,
				})
				.evaluate('salarié . contrat . apprentissage . ancienneté')
				.nodeValue as number

		it('est inférieure à 1 an la veille de la date anniversaire, sur une année bissextile', () => {
			expect(ancienneté('01/03/2027', '29/02/2028')).toBeLessThan(1)
		})

		it('est inférieure à 1 an la veille de la date anniversaire, sur une année commune', () => {
			expect(ancienneté('01/09/2025', '31/08/2026')).toBeLessThan(1)
		})

		it('est de 1 an à la date anniversaire, sur une année bissextile', () => {
			expect(ancienneté('01/03/2027', '01/03/2028')).toBe(1)
		})

		it('est de 1 an à la date anniversaire, sur une année commune', () => {
			expect(ancienneté('01/09/2025', '01/09/2026')).toBe(1)
		})

		it('est inférieure à 2 ans la veille de la 2e date anniversaire', () => {
			expect(ancienneté('01/03/2027', '28/02/2029')).toBeLessThan(2)
		})

		it('est de 2 ans à la 2e date anniversaire', () => {
			expect(ancienneté('01/03/2027', '01/03/2029')).toBe(2)
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
			// Les noms des deux notifications sont inversés par rapport à leurs conditions : « avec RQTH »
			// s’affiche sans situation de handicap, et inversement. Leur renommage (breaking change) relève d’une PR à part.
			const notification =
				handicap === 'non'
					? 'salarié . contrat . apprentissage . ancienneté . durée maximale avec RQTH'
					: 'salarié . contrat . apprentissage . ancienneté . durée maximale sans RQTH'

			return e.evaluate(notification).nodeValue === true
		}

		it('ne s’affiche pas avant 3 ans pour un⋅e apprenti⋅e sans situation de handicap', () => {
			expect(notificationAffichée('non', '31/08/2028')).toBe(false)
		})

		it('s’affiche au bout de 3 ans pour un⋅e apprenti⋅e sans situation de handicap', () => {
			expect(notificationAffichée('non', '01/09/2028')).toBe(true)
		})

		it('ne s’affiche pas au bout de 3 ans pour un⋅e apprenti⋅e en situation de handicap', () => {
			expect(notificationAffichée('oui', '01/09/2028')).toBe(false)
		})

		it('ne s’affiche pas avant 4 ans pour un⋅e apprenti⋅e en situation de handicap', () => {
			expect(notificationAffichée('oui', '31/08/2029')).toBe(false)
		})

		it('s’affiche au bout de 4 ans pour un⋅e apprenti⋅e en situation de handicap', () => {
			expect(notificationAffichée('oui', '01/09/2029')).toBe(true)
		})
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
