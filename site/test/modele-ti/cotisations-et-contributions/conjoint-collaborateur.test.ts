import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'indépendant . conjoint collaborateur': 'oui',
}
const situationRevenuAvecPartage = {
	'indépendant . conjoint collaborateur . choix assiette':
		"'revenu avec partage'",
	'indépendant . conjoint collaborateur . choix assiette . proportion':
		"'moitié'",
}
const situationRevenuSansPartage = {
	'indépendant . conjoint collaborateur . choix assiette':
		"'revenu sans partage'",
	'indépendant . conjoint collaborateur . choix assiette . proportion':
		"'moitié'",
}
const situationAcre = {
	'entreprise . date de création': '18/02/2026',
	'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
		'oui',
}

describe('Conjoint collaborateur', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		engine = new Engine(rules)
		PASS = engine.evaluate({
			valeur: 'plafond sécurité sociale',
			unité: '€/an',
		}).nodeValue as number
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe('l’assiette de cotisations', () => {
			it('est égale au tiers du PASS avec l’option assiette forfaitaire', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . choix assiette':
						"'forfaitaire'",
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					Math.round(PASS / 3)
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu sans partage proportion 1/3', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'tiers'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					20_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu sans partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					30_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/3', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'tiers'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					20_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					30_000
				)
			})
		})

		describe('montant des cotisations', () => {
			it('indemnité journalières = 40% du PASS x taux de 0,5%', () => {
				const e = engine.setSituation(defaultSituation)

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . indemnités journalières'
				).nodeValue as number
				expect(assietteMinimale).toEqual(Math.round((PASS * 40) / 100))

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations . indemnités journalières',
					Math.round((assietteMinimale * 0.5) / 100)
				)
			})

			it('utilise le même barème pour la retraite de base', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'30000 €/an',
				})

				// Voir le test : Cotisation retraite de base
				// > pour les artisans, commerçants et PLNR
				// > applique le taux T1 uniquement en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS
				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations . retraite de base',
					Math.round((30_000 * 17.87) / 100)
				)
			})

			it('utilise le même barème pour la retraite complémentaire', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
				})

				// Voir le test : Cotisation retraite complémentaire
				// > pour les artisans, commerçants et PLNR
				// > applique le taux tranche 1 au PASS et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS
				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations . retraite complémentaire',
					Math.round((PASS * 8.1) / 100 + ((100_000 - PASS) * 9.1) / 100)
				)
			})

			it('utilise le même barème pour l’invalidité-décès', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'30000 €/an',
				})

				// Voir le test : Cotisation invalidité et décès
				// > pour les artisans, commerçants et PLNR
				// > applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre 11,5% du PASS et 1 PASS
				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations . invalidité et décès',
					Math.round((30_000 * 1.3) / 100)
				)
			})
		})

		describe('exonérations', () => {
			it('applique l’Acre en cas de revenus avec partage', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuAvecPartage,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number
				const IJ = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations . indemnités journalières'
				).nodeValue as number
				const RB = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations . retraite de base'
				).nodeValue as number
				const ID = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					...situationRevenuAvecPartage,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).toBeApplicable(
					'indépendant . conjoint collaborateur . cotisations . exonération Acre'
				)
				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations - (IJ + RB + ID)
				)
			})

			// TODO: mettre à jour une fois le calcul de l'Acre corrigé
			it.skip('applique l’Acre sur la cotisation IJ même en cas de revenus supérieurs au plafond d’exonération', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuAvecPartage,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number
				const IJ = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations . indemnités journalières'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					...situationRevenuAvecPartage,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				expect(e2).toBeApplicable(
					'indépendant . conjoint collaborateur . cotisations . exonération Acre'
				)
				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations - IJ
				)
			})

			it('n’applique pas l’Acre en cas de revenus sans partage', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuSansPartage,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})
				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					...situationRevenuSansPartage,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).not.toBeApplicable(
					'indépendant . conjoint collaborateur . cotisations . exonération Acre'
				)
				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations
				)
			})

			it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})
				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					'indépendant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).not.toBeApplicable(
					'indépendant . conjoint collaborateur . cotisations . exonération Acre'
				)
				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations
				)
			})

			it('n’applique pas l’exonération invalidité', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
					'indépendant . cotisations et contributions . cotisations . exonérations . invalidité':
						'oui',
					'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
						'9 mois',
				})

				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations
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

		describe('l’assiette de cotisations', () => {
			it('est égale à la moitié du PASS avec l’option assiette forfaitaire', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . choix assiette':
						"'forfaitaire'",
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					Math.round(PASS / 2)
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu sans partage proportion 1/4', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'quart'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					15_000
				)
			})

			it('est égale au quart de l’assiette sociale avec l’option revenu sans partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					30_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/4', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'quart'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					15_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'indépendant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'indépendant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . assiette de cotisations',
					30_000
				)
			})
		})

		describe('calcule les cotisations', () => {
			it('indemnité journalières = 40% du PASS x taux de 0,3%', () => {
				const e = engine.setSituation(defaultSituationPLR)

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . indemnités journalières'
				).nodeValue as number
				expect(assietteMinimale).toEqual(Math.round((40 / 100) * PASS))

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations . indemnités journalières',
					Math.round((assietteMinimale * 0.3) / 100)
				)
			})

			describe('retraite de base', () => {
				it('utilise le même barème', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . assiette de cotisations':
							'30000 €/an',
					})

					// Voir le test : Cotisation retraite de base
					// > pour les PLR
					// > applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS
					expect(e).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base',
						Math.round((30_000 * 8.73) / 100 + (30_000 * 1.87) / 100)
					)
				})
			})

			describe('retraite complémentaire', () => {
				it('vaut le quart de la cotisation avec l’option assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite complémentaire'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu sans partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite complémentaire'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu avec partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite complémentaire'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut la moitié de la cotisation avec l’option revenu sans partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite complémentaire'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})

				it('vaut la moitié de la cotisation avec l’option revenu avec partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite complémentaire'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})
			})

			describe('invalidité-décès', () => {
				it('vaut le quart de la cotisation avec l’option assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu sans partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu avec partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut la moitié de la cotisation avec l’option revenu sans partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})

				it('vaut la moitié de la cotisation avec l’option revenu avec partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'indépendant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'indépendant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})
			})

			describe('exonérations', () => {
				it('applique l’Acre en cas de revenus avec partage', () => {
					const e1 = engine.setSituation({
						...defaultSituationPLR,
						...situationRevenuAvecPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					const cotisations = e1.evaluate(
						'indépendant . conjoint collaborateur . cotisations'
					).nodeValue as number
					const IJ = e1.evaluate(
						'indépendant . conjoint collaborateur . cotisations . indemnités journalières'
					).nodeValue as number
					const RB = e1.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base'
					).nodeValue as number
					const ID = e1.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue as number

					const e2 = engine.setSituation({
						...defaultSituationPLR,
						...situationAcre,
						...situationRevenuAvecPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					expect(e2).toBeApplicable(
						'indépendant . conjoint collaborateur . cotisations . exonération Acre'
					)
					expect(e2).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations',
						cotisations - (IJ + RB + ID)
					)
				})

				it('n’applique pas l’Acre en cas de revenus sans partage', () => {
					const e1 = engine.setSituation({
						...defaultSituationPLR,
						...situationRevenuSansPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})
					const cotisations = e1.evaluate(
						'indépendant . conjoint collaborateur . cotisations'
					).nodeValue as number

					const e2 = engine.setSituation({
						...defaultSituationPLR,
						...situationAcre,
						...situationRevenuSansPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					expect(e2).not.toBeApplicable(
						'indépendant . conjoint collaborateur . cotisations . exonération Acre'
					)
					expect(e2).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations',
						cotisations
					)
				})

				it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
					const e1 = engine.setSituation({
						...defaultSituationPLR,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})
					const cotisations = e1.evaluate(
						'indépendant . conjoint collaborateur . cotisations'
					).nodeValue as number

					const e2 = engine.setSituation({
						...defaultSituationPLR,
						...situationAcre,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					expect(e2).not.toBeApplicable(
						'indépendant . conjoint collaborateur . cotisations . exonération Acre'
					)
					expect(e2).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations',
						cotisations
					)
				})
			})

			it('n’applique pas l’exonération invalidité', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
					'indépendant . cotisations et contributions . cotisations . exonérations . invalidité':
						'oui',
					'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
						'9 mois',
				})

				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations
				)
			})

			it('n’applique pas l’exonération âge', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
					'indépendant . cotisations et contributions . cotisations . exonérations . âge':
						'oui',
				})

				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations
				)
			})

			it('n’applique pas l’exonération incapacité CNAVPL', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(
					'indépendant . conjoint collaborateur . cotisations'
				).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . assiette de cotisations':
						'100000 €/an',
					'indépendant . profession libérale . CNAVPL . exonération incapacité':
						'oui',
				})

				expect(e2).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations',
					cotisations
				)
			})
		})
	})
})
