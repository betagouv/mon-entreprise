import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'entreprise . imposition': "'IR'",
}

describe('Cotisation invalidité et décès', () => {
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
		const TAUX = 1.3 / 100

		it('applique une assiette minimale égale à 11,5% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . invalidité et décès'
			).nodeValue as number
			expect(assietteMinimale).toEqual(Math.round((PASS * 11.5) / 100))

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				assietteMinimale
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				Math.round(assietteMinimale * TAUX)
			)
		})

		it('applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre 11,5% du PASS et 1 PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				30_000
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				Math.round(30_000 * TAUX)
			)
		})

		it('applique une assiette maximale égale au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				PASS
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				Math.round(PASS * TAUX)
			)
		})

		describe('n’applique pas d’assiette minimale', () => {
			it('en cas de RSA ou de prime d’activité', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'situation personnelle . RSA': 'oui',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					1_000
				)
			})

			it('en cas d’activité saisonnière', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
					'entreprise . activité . saisonnière': 'oui',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					1_000
				)
			})
		})

		// Exemples issus de la doc Urssaf
		describe('en cas d’année incomplète', () => {
			it('applique une assiette minimale proratisée', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2026',
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				const PSSProratisé = e.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				expect(PSSProratisé).toEqual(Math.round((PASS * 152) / 365))

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . invalidité et décès'
				).nodeValue as number
				expect(assietteMinimale).toEqual(
					Math.round((PSSProratisé * 11.5) / 100)
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					assietteMinimale
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					Math.round(assietteMinimale * TAUX)
				)
			})

			it('applique une assiette maximale proratisée', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2026',
					'indépendant . cotisations et contributions . assiette sociale':
						'40000 €/an',
				})

				const PSSProratisé = e.evaluate('indépendant . PSS proratisé')
					.nodeValue as number
				expect(PSSProratisé).toEqual(Math.round((PASS * 152) / 365))

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					PSSProratisé
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					Math.round(PSSProratisé * TAUX)
				)
			})

			it('applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre les assiettes minimale et maximale proratisées', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2026',
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					10_000
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					Math.round(10_000 * TAUX)
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
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				30_000 - 10_000
			)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		describe('applique la cotisation invalidité et décès de la caisse correspondant au métier', () => {
			it('Chirurgien-dentiste', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . profession libérale . réglementée . métier':
						"'santé . chirurgien-dentiste'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARCDSF = e.evaluate(
					'indépendant . profession libérale . réglementée . CARCDSF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue as number
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . profession libérale . réglementée . CARCDSF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCARCDSF)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
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
					'indépendant . profession libérale . réglementée . CARMF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . profession libérale . réglementée . CARPIMKO . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . profession libérale . réglementée . CAVEC . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . profession libérale . réglementée . CAVP . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . profession libérale . réglementée . CNBF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . profession libérale . Cipav . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . profession libérale . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCIPAV)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})
		})

		describe('affiliées Cipav', () => {
			const TAUX = 0.5 / 100

			it('applique une assiette minimale égale à 37% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . invalidité et décès Cipav'
				).nodeValue as number
				expect(assietteMinimale).toEqual(Math.round((PASS * 37) / 100))

				expect(e).toEvaluate(
					'indépendant . profession libérale . Cipav . invalidité et décès . assiette',
					assietteMinimale
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					Math.round(assietteMinimale * TAUX)
				)
			})

			it('applique un taux de 0,5% en cas d’assiette sociale comprise entre 37% du PASS et 1,85 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . profession libérale . Cipav . invalidité et décès . assiette',
					50_000
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					Math.round(50_000 * TAUX)
				)
			})

			it('applique une assiette maximale égale à 1,85 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . profession libérale . Cipav . invalidité et décès . assiette',
					1.85 * PASS
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					Math.round(1.85 * PASS * TAUX)
				)
			})

			describe('n’applique pas d’assiette minimale', () => {
				it('en cas de RSA ou de prime d’activité', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . cotisations et contributions . assiette sociale':
							'1000 €/an',
						'situation personnelle . RSA': 'oui',
					})

					expect(e).toEvaluate(
						'indépendant . profession libérale . Cipav . invalidité et décès . assiette',
						1_000
					)
				})

				it('en cas d’activité saisonnière', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . cotisations et contributions . assiette sociale':
							'1000 €/an',
						'entreprise . activité . saisonnière': 'oui',
					})

					expect(e).toEvaluate(
						'indépendant . profession libérale . Cipav . invalidité et décès . assiette',
						1_000
					)
				})
			})
		})
	})
})
