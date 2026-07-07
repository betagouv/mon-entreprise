import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATIONS =
	'independant . cotisations et contributions . cotisations . conjoint collaborateur'

const defaultSituation = {
	'independant . conjoint collaborateur': 'oui',
}
const situationRevenuAvecPartage = {
	'independant . conjoint collaborateur . choix assiette':
		"'revenu avec partage'",
	'independant . conjoint collaborateur . choix assiette . proportion':
		"'moitié'",
}
const situationRevenuSansPartage = {
	'independant . conjoint collaborateur . choix assiette':
		"'revenu sans partage'",
	'independant . conjoint collaborateur . choix assiette . proportion':
		"'moitié'",
}
const situationAcre = {
	'entreprise . date de création': '01/01/2026',
	'independant . cotisations et contributions . cotisations . exonérations . Acre':
		'oui',
}

describe('Conjoint collaborateur', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		engine = new Engine(rules)
		PASS = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('pour les A/C/PLNR', () => {
		describe('l’assiette de cotisations retraite et invalidité-décès', () => {
			it('est égale au tiers du PASS avec l’option assiette forfaitaire', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . choix assiette':
						"'forfaitaire'",
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					Math.round(PASS / 3)
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu sans partage proportion 1/3', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'tiers'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					20_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu sans partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					30_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/3', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'tiers'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					20_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					30_000
				)
			})

			it('est égale à 450 Smic horaire mahorais à Mayotte', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'établissement . commune . département': "'Mayotte'",
				})

				const Smic = e.evaluate("SMIC . horaire . début d'année")
					.nodeValue as number

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					Math.round(450 * Smic)
				)
			})
		})

		describe('montant des cotisations', () => {
			it('indemnité journalières = 40% du PASS x taux de 0,5%', () => {
				const e = engine.setSituation(defaultSituation)

				const assietteMinimale = e.evaluate(
					'independant . assiette minimale . indemnités journalières'
				).nodeValue as number
				expect(assietteMinimale).toEqual(Math.round((PASS * 40) / 100))

				expect(e).toEvaluate(
					`${COTISATIONS} . indemnités journalières`,
					Math.round((assietteMinimale * 0.5) / 100)
				)
			})

			it('utilise le même barème pour la retraite de base', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'30000 €/an',
				})

				// Voir le test : Cotisation retraite de base
				// > pour les artisans, commerçants et PLNR
				// > applique le taux T1 uniquement en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS
				expect(e).toEvaluate(
					`${COTISATIONS} . retraite de base`,
					Math.round((30_000 * 17.87) / 100)
				)
			})

			it('utilise le même barème pour la retraite complémentaire', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
				})

				// Voir le test : Cotisation retraite complémentaire
				// > pour les artisans, commerçants et PLNR
				// > applique le taux tranche 1 au PASS et le taux tranche 2 au reste de l’assiette sociale en cas d’assiette sociale comprise entre 1 et 4 PASS
				expect(e).toEvaluate(
					`${COTISATIONS} . retraite complémentaire`,
					Math.round((PASS * 8.1) / 100 + ((100_000 - PASS) * 9.1) / 100)
				)
			})

			it('utilise le même barème pour l’invalidité-décès', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'30000 €/an',
				})

				// Voir le test : Cotisation invalidité et décès
				// > pour les artisans, commerçants et PLNR
				// > applique le taux de 1,3% à l’assiette sociale lorsqu’elle est comprise entre 11,5% du PASS et 1 PASS
				expect(e).toEvaluate(
					`${COTISATIONS} . invalidité et décès`,
					Math.round((30_000 * 1.3) / 100)
				)
			})
		})

		describe('exonérations', () => {
			it('applique l’Acre en cas de revenus avec partage', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
					.nodeValue as number
				const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
					.nodeValue as number
				const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
					.nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e2).toEvaluate(
					`${COTISATIONS} . indemnités journalières`,
					IJ - Math.round(IJ / 4)
				)
				expect(e2).toEvaluate(
					{
						valeur: `${COTISATIONS} . retraite de base`,
						arrondi: 'oui',
					},
					Math.round(RB - RB / 4)
				)
				expect(e2).toEvaluate(
					`${COTISATIONS} . invalidité et décès`,
					ID - ID / 4
				)
			})

			it('applique l’Acre sur la cotisation IJ même en cas de revenus supérieurs au plafond d’exonération', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
					.nodeValue as number
				const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
					.nodeValue as number
				const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
					.nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				expect(e2).toEvaluate(
					`${COTISATIONS} . indemnités journalières`,
					IJ - Math.round(IJ / 4)
				)
				expect(e2).toEvaluate(`${COTISATIONS} . retraite de base`, RB)
				expect(e2).toEvaluate(`${COTISATIONS} . invalidité et décès`, ID)
			})

			it('n’applique pas l’Acre si le/la dirigeant⋅e n’en bénéficie pas', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					'entreprise . date de création': '01/01/2026',
					'independant . cotisations et contributions . cotisations . exonérations . Acre':
						'non',
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’Acre en cas de revenus sans partage', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					...situationRevenuSansPartage,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					...situationRevenuSansPartage,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					...situationAcre,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’exonération invalidité', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
					'independant . cotisations et contributions . cotisations . exonérations . invalidité':
						'oui',
					'independant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
						'9 mois',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’exonération âge', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
					'entreprise . date de création': '01/01/2006',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
					'independant . cotisations et contributions . cotisations . exonérations . âge':
						'oui',
					'entreprise . date de création': '01/01/2006',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
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
					'independant . conjoint collaborateur . choix assiette':
						"'forfaitaire'",
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					Math.round(PASS / 2)
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu sans partage proportion 1/4', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'quart'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					15_000
				)
			})

			it('est égale au quart de l’assiette sociale avec l’option revenu sans partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu sans partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					30_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/4', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'quart'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					15_000
				)
			})

			it('est égale au tiers de l’assiette sociale avec l’option revenu avec partage proportion 1/2', () => {
				const e = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . choix assiette':
						"'revenu avec partage'",
					'independant . conjoint collaborateur . choix assiette . proportion':
						"'moitié'",
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e).toEvaluate(
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès',
					30_000
				)
			})
		})

		describe('calcule les cotisations', () => {
			it('indemnité journalières = 40% du PASS x taux de 0,3%', () => {
				const e = engine.setSituation(defaultSituationPLR)

				const assietteMinimale = e.evaluate(
					'independant . assiette minimale . indemnités journalières'
				).nodeValue as number
				expect(assietteMinimale).toEqual(Math.round((40 / 100) * PASS))

				expect(e).toEvaluate(
					`${COTISATIONS} . indemnités journalières`,
					Math.round((assietteMinimale * 0.3) / 100)
				)
			})

			describe('retraite de base', () => {
				it('utilise le même barème', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
							'30000 €/an',
					})

					// Voir le test : Cotisation retraite de base
					// > pour les PLR
					// > applique les taux des tranches 1 et 2 en cas d’assiette sociale comprise entre l’assiette minimale et 1 PASS
					expect(e).toEvaluate(
						`${COTISATIONS} . retraite de base`,
						Math.round((30_000 * 8.73) / 100 + (30_000 * 1.87) / 100)
					)
				})
			})

			describe('retraite complémentaire', () => {
				it('vaut le quart de la cotisation avec l’option assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . retraite complémentaire`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu sans partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . retraite complémentaire`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu avec partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . retraite complémentaire`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut la moitié de la cotisation avec l’option revenu sans partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . retraite complémentaire`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})

				it('vaut la moitié de la cotisation avec l’option revenu avec partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . retraite complémentaire'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . retraite complémentaire`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})
			})

			describe('invalidité-décès', () => {
				it('vaut le quart de la cotisation avec l’option assiette forfaitaire', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . invalidité et décès`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu sans partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . invalidité et décès`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut le quart de la cotisation avec l’option revenu avec partage proportion 1/4', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'quart'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . invalidité et décès`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 4)
				})

				it('vaut la moitié de la cotisation avec l’option revenu sans partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu sans partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . invalidité et décès`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})

				it('vaut la moitié de la cotisation avec l’option revenu avec partage proportion 1/2', () => {
					const e = engine.setSituation({
						...defaultSituationPLR,
						'independant . conjoint collaborateur . choix assiette':
							"'revenu avec partage'",
						'independant . conjoint collaborateur . choix assiette . proportion':
							"'moitié'",
						'independant . cotisations et contributions . assiette sociale':
							'50000 €/an',
					})

					const cotisation = e.evaluate(
						'independant . cotisations et contributions . cotisations . invalidité et décès'
					).nodeValue as number
					const cotisationConjoint = e.evaluate(
						`${COTISATIONS} . invalidité et décès`
					).nodeValue

					expect(cotisationConjoint).toEqual(cotisation / 2)
				})
			})
		})

		describe('exonérations', () => {
			it('applique l’Acre en cas de revenus avec partage', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
					.nodeValue as number
				const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
					.nodeValue as number
				const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
					.nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					...situationAcre,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e2).toEvaluate(
					`${COTISATIONS} . indemnités journalières`,
					IJ - Math.round(IJ / 4)
				)
				expect(e2).toEvaluate(
					`${COTISATIONS} . retraite de base`,
					RB - Math.round(RB / 4)
				)
				expect(e2).toEvaluate(
					`${COTISATIONS} . invalidité et décès`,
					ID - ID / 4
				)
			})

			it('applique l’Acre sur la cotisation IJ même en cas de revenus supérieurs au plafond d’exonération', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				const IJ = e1.evaluate(`${COTISATIONS} . indemnités journalières`)
					.nodeValue as number
				const RB = e1.evaluate(`${COTISATIONS} . retraite de base`)
					.nodeValue as number
				const ID = e1.evaluate(`${COTISATIONS} . invalidité et décès`)
					.nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					...situationAcre,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'100000 €/an',
				})

				expect(e2).toEvaluate(
					`${COTISATIONS} . indemnités journalières`,
					IJ - Math.round(IJ / 4)
				)
				expect(e2).toEvaluate(`${COTISATIONS} . retraite de base`, RB)
				expect(e2).toEvaluate(`${COTISATIONS} . invalidité et décès`, ID)
			})

			it('n’applique pas l’Acre si le/la dirigeant⋅e n’en bénéficie pas', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					'entreprise . date de création': '01/01/2026',
					'independant . cotisations et contributions . cotisations . exonérations . Acre':
						'non',
					...situationRevenuAvecPartage,
					'independant . cotisations et contributions . assiette sociale':
						'60000 €/an',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’Acre en cas de revenus sans partage', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					...situationRevenuSansPartage,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					...situationAcre,
					...situationRevenuSansPartage,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’Acre en cas d’assiette forfaitaire', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					...situationAcre,
					'independant . cotisations et contributions . assiette sociale':
						'30000 €/an',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’exonération invalidité', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
					'independant . cotisations et contributions . cotisations . exonérations . invalidité':
						'oui',
					'independant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
						'9 mois',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’exonération âge', () => {
				const e1 = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituationPLR,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
					'independant . cotisations et contributions . cotisations . exonérations . âge':
						'oui',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})

			it('n’applique pas l’exonération incapacité CNAVPL', () => {
				const e1 = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
				})
				const cotisations = e1.evaluate(COTISATIONS).nodeValue as number

				const e2 = engine.setSituation({
					...defaultSituation,
					'independant . conjoint collaborateur . assiette retraite et invalidité-décès':
						'100000 €/an',
					'independant . profession libérale . CNAVPL . exonération incapacité':
						'oui',
				})

				expect(e2).toEvaluate(COTISATIONS, cotisations)
			})
		})
	})
})
