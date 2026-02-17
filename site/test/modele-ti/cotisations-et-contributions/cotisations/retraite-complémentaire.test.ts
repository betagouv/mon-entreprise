import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'entreprise . imposition': "'IR'",
}

describe('Cotisation retraite complémentaire', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate({
			valeur: 'plafond sécurité sociale',
			unité: '€/an',
		}).nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		const TAUX_T1 = 8.1 / 100
		const TAUX_T2 = 9.1 / 100

		it('applique un taux tranche 1 de 8,1%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux tranche 1',
				100 * TAUX_T1
			)
		})

		it('applique un taux tranche 2 de 9,1%', () => {
			expect(engine).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux tranche 2',
				100 * TAUX_T2
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
				Math.round(10_000 * TAUX_T1)
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'100000 €/an',
			})

			const tranche1 = PASS * TAUX_T1
			const tranche2 = (100_000 - PASS) * TAUX_T2

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
				Math.round(tranche1 + tranche2)
			)
		})

		it('applique le taux tranche 1 au PASS et le taux tranche 2 à 3 PASS en cas d’assiette sociale supérieure à 4 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'200000 €/an',
			})

			const tranche1 = PASS * TAUX_T1
			const tranche2 = 3 * PASS * TAUX_T2

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
				Math.round(tranche1 + tranche2)
			)
		})

		describe('en cas d’année incomplète', () => {
			it('applique le taux tranche 1 en cas d’assiette sociale inférieure au PASS proratisé', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . durée d'activité cette année": '150 jour',
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(10_000 * TAUX_T1)
				)
			})

			it('applique le taux tranche 1 au PASS proratisé et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS proratisé', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . durée d'activité cette année": '150 jour',
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				expect(PASSProratisé).toEqual(Math.round((PASS * 150) / 365))

				const tranche1 = PASSProratisé * TAUX_T1
				const tranche2 = (50_000 - PASSProratisé) * TAUX_T2

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(tranche1 + tranche2)
				)
			})

			it('applique le taux tranche 1 au PASS proratisé et le taux tranche 2 à 3 PASS proratisés en cas d’assiette sociale supérieure à 4 PASS proratisés', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . durée d'activité cette année": '150 jour',
					'indépendant . cotisations et contributions . assiette sociale':
						'200000 €/an',
				})

				const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				expect(PASSProratisé).toEqual(Math.round((PASS * 150) / 365))

				const tranche1 = PASSProratisé * TAUX_T1
				const tranche2 = 3 * PASSProratisé * TAUX_T2

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(tranche1 + tranche2)
				)
			})
		})

		it('applique la déduction tabac à l’assiette sociale', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
				'entreprise . activité . commerciale . débit de tabac': 'oui',
				'indépendant . cotisations et contributions . déduction tabac':
					'10000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire . assiette',
				30_000 - 10_000
			)
		})

		describe('en cas de taux spécifiques PLNR', () => {
			const TAUX_SPÉCIFIQUE = 14 / 100

			it('applique un taux tranche 1 nul en cas d’assiette sociale inférieure au PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . activité': "'libérale'",
					'entreprise . date de création': '19/07/2023',
					'indépendant . profession libérale . non réglementée . taux spécifique retraite complémentaire':
						'oui',
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					0
				)
			})

			it('applique le taux tranche 2 à la partie de l’assiette sociale supérieure au PASS en cas d’assiette sociale comprise entre 1 et 4 PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . activité': "'libérale'",
					'entreprise . date de création': '19/07/2023',
					'indépendant . profession libérale . non réglementée . taux spécifique retraite complémentaire':
						'oui',
					'indépendant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				// Tranche 1 : 0 €
				const tranche2 = (100_000 - PASS) * TAUX_SPÉCIFIQUE

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(tranche2)
				)
			})

			it('applique le taux tranche 2 à 3 PASS en cas d’assiette sociale supérieure à 4 PASS', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . activité': "'libérale'",
					'entreprise . date de création': '19/07/2023',
					'indépendant . profession libérale . non réglementée . taux spécifique retraite complémentaire':
						'oui',
					'indépendant . cotisations et contributions . assiette sociale':
						'200000 €/an',
				})

				// Tranche 1 : 0 €
				const tranche2 = 3 * PASS * TAUX_SPÉCIFIQUE

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(tranche2)
				)
			})
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
					'indépendant . profession libérale . réglementée . métier':
						"'santé . chirurgien-dentiste'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARCDSF = e.evaluate(
					'indépendant . profession libérale . réglementée . CARCDSF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
				).nodeValue as number
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARCDSF)
				expect(cotisationIndépendant).toEqual(Math.round(cotisationCNAVPL))
			})

			it('Sage-femme', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . profession libérale . réglementée . métier':
						"'santé . sage-femme'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARCDSF = e.evaluate(
					'indépendant . profession libérale . réglementée . CARCDSF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
				).nodeValue as number
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARCDSF)
				expect(cotisationIndépendant).toEqual(Math.round(cotisationCNAVPL))
			})

			it('Médecin', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . profession libérale . réglementée . métier':
						"'santé . médecin'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARMF = e.evaluate(
					'indépendant . profession libérale . réglementée . CARMF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
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
					'indépendant . profession libérale . réglementée . métier':
						"'santé . auxiliaire médical'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARPIMKO = e.evaluate(
					'indépendant . profession libérale . réglementée . CARPIMKO . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
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
					'indépendant . profession libérale . réglementée . métier':
						"'expert-comptable'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCAVEC = e.evaluate(
					'indépendant . profession libérale . réglementée . CAVEC . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
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
					'indépendant . profession libérale . réglementée . métier':
						"'santé . pharmacien'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCAVP = e.evaluate(
					'indépendant . profession libérale . réglementée . CAVP . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
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
					'indépendant . profession libérale . réglementée . métier':
						"'juridique . avocat'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCNBF = e.evaluate(
					'indépendant . profession libérale . réglementée . CNBF . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
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
					'indépendant . profession libérale . Cipav . retraite complémentaire'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . retraite complémentaire'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCIPAV)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})
		})

		describe('affiliées Cipav', () => {
			const TAUX_T1 = 11 / 100
			const TAUX_T2 = 21 / 100

			it('applique le taux tranche 1 de 11% en cas d’assiette sociale inférieure au PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(10_000 * TAUX_T1)
				)
			})

			it('applique le taux tranche 1 de 11% au PASS et le taux tranche 2 de 21% au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				const tranche1 = PASS * TAUX_T1
				const tranche2 = (100_000 - PASS) * TAUX_T2

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(tranche1 + tranche2)
				)
			})

			it('applique le taux tranche 1 de 11% au PASS et le taux tranche 2 de 21% à 3 PASS en cas d’assiette sociale supérieure à 4 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'200000 €/an',
				})

				const tranche1 = PASS * TAUX_T1
				const tranche2 = 3 * PASS * TAUX_T2

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
					Math.round(tranche1 + tranche2)
				)
			})
		})
	})
})
