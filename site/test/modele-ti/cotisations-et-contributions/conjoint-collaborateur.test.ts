import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'indépendant . conjoint collaborateur': 'oui',
}
const situationAcre = {
	'entreprise . date de création': '18/02/2025',
	'indépendant . cotisations et contributions . cotisations . exonérations . Acre':
		'oui',
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

describe('Conjoint collaborateur', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		describe('l’assiette de cotisations', () => {
			it('est égale au tiers du PASS avec l’option assiette forfaitaire', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'indépendant . conjoint collaborateur . choix assiette':
						"'forfaitaire'",
				})

				const PASS = e.evaluate('plafond sécurité sociale').nodeValue as number

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

		describe('calcule les cotisations', () => {
			it('indemnité journalières = 40% du PASS x taux de 0,5%', () => {
				const e = engine.setSituation(defaultSituation)

				const assietteMinimale = e.evaluate(
					'indépendant . assiette minimale . indemnités journalières'
				).nodeValue as number
				expect(assietteMinimale).toEqual(18840)

				expect(e).toEvaluate(
					'indépendant . conjoint collaborateur . cotisations . indemnités journalières',
					Math.round((assietteMinimale * 0.5) / 100)
				)
			})

			describe('retraite de base', () => {
				it('utilise le même barème', () => {
					const e = engine.setSituation({
						...defaultSituation,
						'indépendant . conjoint collaborateur . assiette de cotisations':
							'30000 €/an',
					})

					// Voir le test : Cotisation retraite de base
					// > pour les artisans, commerçants et PLNR
					// > applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS
					expect(e).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base',
						5145 + 216
					)
				})

				it('applique l’Acre en cas de revenus avec partage', () => {
					const e = engine.setSituation({
						...defaultSituation,
						...situationAcre,
						...situationRevenuAvecPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					// Voir le test : L’exonération Acre
					// > pour les A/C/PLNR
					// > s’applique à la cotisation retraite de base
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						0
					)
					expect(e).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base',
						0
					)
				})

				it('n’applique pas l’Acre en cas de revenus sans partage', () => {
					const e = engine.setSituation({
						...defaultSituation,
						...situationAcre,
						...situationRevenuSansPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base'
					).nodeValue

					expect(cotisation).toBeGreaterThan(0)
				})

				it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituation,
						...situationAcre,
						'indépendant . conjoint collaborateur . assiette de cotisations':
							'30000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base'
					).nodeValue

					expect(cotisation).toBeGreaterThan(0)
				})
			})

			describe('retraite complémentaire', () => {
				it('utilise le même barème', () => {
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
						8629
					)
				})

				it('n’applique pas l’exonération invalidité', () => {
					const e = engine.setSituation({
						...defaultSituation,
						'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité':
							'oui',
						'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité . durée':
							'9 mois',
						'indépendant . cotisations et contributions . assiette sociale':
							'100000 €/an',
						'indépendant . conjoint collaborateur . assiette de cotisations':
							'100000 €/an',
					})

					// Voir le test : L’exonération invalidité
					// > pour les A/C/PLNR
					// > s’applique à la cotisation retraite complémentaire
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite complémentaire',
						Math.round(8629 / 4)
					)
					expect(e).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite complémentaire',
						8629
					)
				})
			})

			describe('invalidité-décès', () => {
				it('utilise le même barème', () => {
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
						390
					)
				})

				it('applique l’Acre en cas de revenus avec partage', () => {
					const e = engine.setSituation({
						...defaultSituation,
						...situationAcre,
						...situationRevenuAvecPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					// Voir le test : L’exonération Acre
					// > pour les A/C/PLNR
					// > s’applique à la cotisation invalidité et décès
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . invalidité et décès',
						0
					)
					expect(e).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès',
						0
					)
				})

				it('n’applique pas l’Acre en cas de revenus sans partage', () => {
					const e = engine.setSituation({
						...defaultSituation,
						...situationAcre,
						...situationRevenuSansPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisation).toBeGreaterThan(0)
				})

				it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituation,
						...situationAcre,
						'indépendant . conjoint collaborateur . assiette de cotisations':
							'30000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . invalidité et décès'
					).nodeValue

					expect(cotisation).toBeGreaterThan(0)
				})
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

				const PASS = e.evaluate('plafond sécurité sociale').nodeValue as number

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
				expect(assietteMinimale).toEqual(18840)

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
						2619 + 561
					)
				})

				it('applique l’Acre en cas de revenus avec partage', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						...situationAcre,
						...situationRevenuAvecPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					// Voir le test : L’exonération Acre
					// > pour les A/C/PLNR
					// > s’applique à la cotisation retraite de base
					expect(e).toEvaluate(
						'indépendant . cotisations et contributions . cotisations . retraite de base',
						0
					)
					expect(e).toEvaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base',
						0
					)
				})

				it('n’applique pas l’Acre en cas de revenus sans partage', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						...situationAcre,
						...situationRevenuSansPartage,
						'indépendant . cotisations et contributions . assiette sociale':
							'30000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base'
					).nodeValue

					expect(cotisation).toBeGreaterThan(0)
				})

				it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						...situationAcre,
						'indépendant . conjoint collaborateur . assiette de cotisations':
							'30000 €/an',
					})

					const cotisation = e.evaluate(
						'indépendant . conjoint collaborateur . cotisations . retraite de base'
					).nodeValue

					expect(cotisation).toBeGreaterThan(0)
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
		})
	})
})
