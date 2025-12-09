import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('Cotisation invalidité et décès', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('applique une assiette minimale égale à 11,5% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'1000 €/an',
			})

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . invalidité et décès'
			).nodeValue
			expect(assietteMinimale).toEqual(5417)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				assietteMinimale
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				70
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
				30000
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				390
			)
		})

		it('applique une assiette maximale égale au PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			const PASS = e.evaluate('plafond sécurité sociale').nodeValue

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
				PASS
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . invalidité et décès',
				612
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
					1000
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
					1000
				)
			})
		})

		describe('en cas d’année incomplète', () => {
			it('applique une assiette minimale proratisée', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . invalidité et décès'
				).nodeValue
				expect(assietteMinimale).toEqual(2256)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					assietteMinimale
				)
			})

			it('applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre les assiettes minimale et maximale proratisées', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'10000 €/an',
				})

				expect(e).toEvaluate('indépendant . PSS proratisé', 19614)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					10000
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					130
				)
			})

			it('applique une assiette maximale proratisée', () => {
				const e = engine.setSituation({
					...defaultSituation,
					"entreprise . en cessation d'activité": 'oui',
					'entreprise . date de cessation': '01/06/2025',
					'indépendant . cotisations et contributions . assiette sociale':
						'40000 €/an',
				})

				const PSSProratisé = e.evaluate('indépendant . PSS proratisé').nodeValue
				expect(PSSProratisé).toEqual(19614)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès . assiette',
					PSSProratisé
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

		describe('applique la cotisation invalidité et décès de la caisse correspondant au métier', () => {
			it('Chirurgien-dentiste', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . PL . métier': "'santé . chirurgien-dentiste'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARCDSF = e.evaluate(
					'indépendant . PL . CARCDSF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
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
					'indépendant . PL . CARCDSF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
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
					'indépendant . PL . métier': "'santé . médecin'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARMF = e.evaluate(
					'indépendant . PL . CARMF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
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
					'indépendant . PL . métier': "'santé . auxiliaire médical'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCARPIMKO = e.evaluate(
					'indépendant . PL . CARPIMKO . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
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
					'indépendant . PL . métier': "'expert-comptable'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCAVEC = e.evaluate(
					'indépendant . PL . CAVEC . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
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
					'indépendant . PL . métier': "'santé . pharmacien'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCAVP = e.evaluate(
					'indépendant . PL . CAVP . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
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
					'indépendant . PL . métier': "'juridique . avocat'",
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisationCNBF = e.evaluate(
					'indépendant . PL . CNBF . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
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
					'indépendant . PL . CIPAV . invalidité et décès'
				).nodeValue
				const cotisationCNAVPL = e.evaluate(
					'indépendant . PL . CNAVPL . invalidité et décès'
				).nodeValue
				const cotisationIndépendant = e.evaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès'
				).nodeValue

				expect(cotisationCNAVPL).toEqual(cotisationCIPAV)
				expect(cotisationIndépendant).toEqual(cotisationCNAVPL)
			})
		})

		describe('affiliées Cipav', () => {
			it('applique une assiette minimale égale à 37% du PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'1000 €/an',
				})

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . invalidité et décès Cipav'
				).nodeValue
				expect(assietteMinimale).toEqual(17427)

				expect(e).toEvaluate(
					'indépendant . PL . CIPAV . invalidité et décès . assiette',
					assietteMinimale
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					87
				)
			})

			it('applique un taux de 0,5% en cas d’assiette sociale comprise entre 37% du PASS et 1,85 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . PL . CIPAV . invalidité et décès . assiette',
					50000
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					250
				)
			})

			it('applique une assiette maximale égale à 1,85 PASS', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				const PASS = e.evaluate('plafond sécurité sociale').nodeValue as number
				expect(e).toEvaluate(
					'indépendant . PL . CIPAV . invalidité et décès . assiette',
					1.85 * PASS
				)

				expect(e).toEvaluate(
					'indépendant . cotisations et contributions . cotisations . invalidité et décès',
					436
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
						'indépendant . PL . CIPAV . invalidité et décès . assiette',
						1000
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
						'indépendant . PL . CIPAV . invalidité et décès . assiette',
						1000
					)
				})
			})
		})
	})
})
