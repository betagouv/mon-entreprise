import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation retraite complémentaire', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe('en cas d’année incomplète', () => {
			it('applique le taux tranche 1 en cas d’assiette sociale inférieure au PASS proratisé', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . durée d'activité cette année": '150 jour',
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 19356)
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					810
				)
			})

			it('applique le taux tranche 1 au PASS proratisé et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS proratisé', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . durée d'activité cette année": '150 jour',
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 19356)
				// Tranche 1 :
				// 1 PASS proratisé x taux tranche 1 = 19 356 €/an x 8,1% = 1 567,84 €/an

				// Tranche 2 :
				// assiette sociale - 1 PASS proratisé = 50 000 €/an - 19 356 €/an = 30 644 €/an
				// (assiette sociale - 1 PASS proratisé) x taux tranche 2 = 30 644 €/an x 9,1% = 2 788,60 €/an

				// Total :
				// Tranche 1 + Tranche 2 = 1 567,84 €/an + 2 788,60 €/an = 4 356,44 €/an
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					4356
				)
			})

			it('applique le taux tranche 1 au PASS proratisé et le taux tranche 2 à 3 PASS proratisés en cas d’assiette sociale supérieure à 4 PASS proratisés', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . durée d'activité cette année": '150 jour',
					'indépendant . cotisations et contributions . assiette sociale':
						'200000 €/an',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 19356)
				// Tranche 1 :
				// 1 PASS proratisé x taux tranche 1 = 19 356 €/an x 8,1% = 1 567,84 €/an

				// Tranche 2 :
				// 3 PASS proratisé = 3 x 19 356 €/an = 58 068 €/an
				// 3 PASS proratisé x taux tranche 2 = 58 068 €/an x 9,1% = 5 284,19 €/an

				// Total :
				// Tranche 1 + Tranche 2 = 1 567,84 €/an + 5 284,19 €/an = 6 852,03 €/an
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					6852
				)
			})
		})

		it('applique un taux tranche 1 de 8,1%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux tranche 1',
				8.1
			)
		})

		it('applique un taux tranche 2 de 9,1%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux tranche 2',
				9.1
			)
		})

		it('applique le taux tranche 1 en cas d’assiette sociale inférieure au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'10000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
				810
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			// Tranche 1 :
			// 1 PASS x taux tranche 1 = 47 100 €/an x 8,1% = 3 815 €/an

			// Tranche 2 :
			// assiette sociale - 1 PASS = 100 000 €/an - 47 100 €/an = 52 900 €/an
			// (assiette sociale - 1 PASS) x taux tranche 2 = 52 900 €/an x 9,1% = 4 814 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 3 815 €/an + 4 814 €/an = 8 629 €/an
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
				8629
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à 3 PASS en cas d’assiette sociale supérieure à 4 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'200000 €/an',
			})

			// Tranche 1 :
			// 1 PASS x taux tranche 1 = 47 100 €/an x 8,1% = 3 815 €/an

			// Tranche 2 :
			// 3 PASS = 3 x 47 100 €/an = 141 300 €/an
			// 3 PASS x taux tranche 2 = 141 300 €/an x 9,1% = 12 858 €/an

			// Total :
			// Tranche 1 + Tranche 2 = 3 815 €/an + 12 858 €/an = 16 673 €/an
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
				16673
			)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		describe('applique la cotisation retraite complémentaire de la caisse correspondant au métier', () => {
			it('Chirurgien-dentiste', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'santé . chirurgien-dentiste'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARCDSF = e.evaluate(
					'indépendant . PL . CARCDSF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARCDSF)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Sage-femme', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'santé . sage-femme'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARCDSF = e.evaluate(
					'indépendant . PL . CARCDSF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARCDSF)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Médecin', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'santé . médecin'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARMF = e.evaluate(
					'indépendant . PL . CARMF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARMF)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Auxiliaire médical', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'santé . auxiliaire médical'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARPIMKO = e.evaluate(
					'indépendant . PL . CARPIMKO . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARPIMKO)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Expert-comptable', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'expert-comptable'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCAVEC = e.evaluate(
					'indépendant . PL . CAVEC . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCAVEC)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Pharmacien', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'santé . pharmacien'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCAVP = e.evaluate(
					'indépendant . PL . CAVP . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCAVP)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Avocat', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'juridique . avocat'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCNBF = e.evaluate(
					'indépendant . PL . CNBF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCNBF)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})

			it('Cipav', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCIPAV = e.evaluate(
					'indépendant . PL . CIPAV . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCIPAV)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})
		})

		describe('affiliées Cipav', () => {
			it('applique le taux tranche 1 de 11% en cas d’assiette sociale inférieure au PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					1100
				)
			})

			it('applique le taux tranche 1 de 11% au PASS et le taux tranche 2 de 21% au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				// Tranche 1 :
				// 1 PASS x taux tranche 1 = 47 100 €/an x 11% = 5 181 €/an

				// Tranche 2 :
				// assiette sociale - 1 PASS = 100 000 €/an - 47 100 €/an = 52 900 €/an
				// (assiette sociale - 1 PASS) x taux tranche 2 = 52 900 €/an x 21% = 11 109 €/an

				// Total :
				// Tranche 1 + Tranche 2 = 5 181 €/an + 11 109 €/an = 16 290 €/an
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					16290
				)
			})

			it('applique le taux tranche 1 de 11% au PASS et le taux tranche 2 de 21% à 3 PASS en cas d’assiette sociale supérieure à 4 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'200000 €/an',
				})

				// Tranche 1 :
				// 1 PASS x taux tranche 1 = 47 100 €/an x 11% = 5 181 €/an

				// Tranche 2 :
				// 3 PASS = 3 x 47 100 €/an = 141 300 €/an
				// 3 PASS x taux tranche 2 = 141 300 €/an x 21% = 29 673 €/an

				// Total :
				// Tranche 1 + Tranche 2 = 5 181 €/an + 29 673 €/an = 34 854 €/an
				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					34854
				)
			})
		})
	})
})
