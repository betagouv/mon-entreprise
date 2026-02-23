import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'entreprise . imposition': "'IR'",
	"entreprise . chiffre d'affaires": '10000 €/an',
	'entreprise . date de création': '18/02/2026',
}

describe('Cotisations de début d’activité', () => {
	let engine: Engine
	let PASS: number
	beforeEach(() => {
		engine = new Engine(rules)
		PASS = engine.evaluate({
			valeur: 'plafond sécurité sociale',
			unité: '€/an',
		}).nodeValue as number
	})

	describe('Pour les A/C/PLNR', () => {
		it('applique une assiette forfaitaire égale à 19% du PASS proratisé', () => {
			const e = engine.setSituation(defaultSituation)
			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				Math.round((PASSProratisé * 19) / 100)
			)
		})

		it('applique une assiette forfaitaire indemnités journalières égale à 40% du PASS non proratisé', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire indemnités journalières',
				Math.round((PASS * 40) / 100)
			)
		})

		it('applique les assiettes forfaitaires au calcul des cotisations et contributions', () => {
			const e = engine.setSituation(defaultSituation)

			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number
			const assietteForfaitaire = Math.round((PASSProratisé * 19) / 100)

			/** Cotisation maladie-maternité :
			 * assiette = 19% du PASS
			 * assiette < 1er plafond (20% du PASS)
			 * => taux nul
			 */

			/** Cotisation indemnités journalières :
			 * assiette = 40% du PASS (non proratisé)
			 * taux = 0,5%
			 * => 94 €
			 */
			const IJ = Math.round((Math.round((PASS * 40) / 100) * 0.5) / 100)

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette = 19% du PASS proratisé
			 * tranche 2 = 0 €
			 * taux tranche 1 = 17,87%
			 * tranche 2 = 0 (assiette < PASS proratisé)
			 */
			const RB = Math.round((assietteForfaitaire * 17.87) / 100)

			/** Cotisation retraite complémentaire :
			 * assiette = 19% du PASS proratisé
			 * tranche 2 = 0 €
			 * taux tranche 1 = 8,1%
			 */
			const RC = Math.round((assietteForfaitaire * 8.1) / 100)

			/** Cotisation invalidité-décès :
			 * assiette = 19% du PASS proratisé
			 * taux = 1,3%
			 */
			const ID = Math.round((assietteForfaitaire * 1.3) / 100)

			/** CSG-CRDS :
			 * assiette = 19% du PASS proratisé
			 * taux = 9,7%
			 */
			const CSG = Math.round((assietteForfaitaire * 9.7) / 100)

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * assiette = PASS
			 * taux = 0,25%
			 */
			const CFP = Math.round((PASS * 0.25) / 100)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				IJ + RB + RC + ID + CSG + CFP
			)
		})
	})

	describe('Pour les PLR (Cipav)', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('applique une assiette forfaitaire égale à 19% du PASS proratisé', () => {
			const e = engine.setSituation(defaultSituationPLR)
			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				Math.round((PASSProratisé * 19) / 100)
			)
		})

		it('applique une assiette forfaitaire indemnités journalières égale à 40% du PASS non proratisé', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire indemnités journalières',
				Math.round((PASS * 40) / 100)
			)
		})

		it('applique une assiette forfaitaire invalidité décès égale à 37% du PASS proratisé', () => {
			const e = engine.setSituation(defaultSituationPLR)
			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire invalidité décès Cipav',
				Math.round((PASSProratisé * 37) / 100)
			)
		})

		it('applique les assiettes forfaitaires au calcul des cotisations et contributions', () => {
			const e = engine.setSituation(defaultSituationPLR)

			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number
			const assietteForfaitaire = Math.round((PASSProratisé * 19) / 100)

			/** Cotisation maladie-maternité :
			 * assiette = 19% du PASS
			 * assiette < 1er plafond (20% du PASS)
			 * => taux nul
			 */

			/** Cotisation indemnités journalières :
			 * assiette = 40% du PASS (non proratisé)
			 * taux = 0,3%
			 * => 94 €
			 */
			const IJ = Math.round((Math.round((PASS * 40) / 100) * 0.3) / 100)

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette = 19% du PASS proratisé
			 * taux tranche 1 = 8,731%
			 * taux tranche 2 = 1,87%
			 * tranche 2 = 0 (assiette < PASS proratisé)
			 */
			const RB =
				Math.round((assietteForfaitaire * 8.73) / 100) +
				Math.round((assietteForfaitaire * 1.87) / 100)

			/** Cotisation retraite complémentaire :
			 * assiette = 19% du PASS proratisé
			 * tranche 2 = 0 €
			 * taux tranche 1 = 11%
			 */
			const RC = Math.round((assietteForfaitaire * 11) / 100)

			/** Cotisation invalidité-décès :
			 * assiette = 37% du PASS proratisé
			 * taux = 0,5%
			 */
			const ID = Math.round(
				(Math.round((PASSProratisé * 37) / 100) * 0.5) / 100
			)

			/** CSG-CRDS :
			 * assiette = 19% du PASS proratisé
			 * taux = 6,8% + 2,9%
			 */
			const CSG = Math.round((assietteForfaitaire * 9.7) / 100)

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * assiette = PASS
			 * taux = 0,25%
			 */
			const CFP = Math.round((PASS * 0.25) / 100)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				IJ + RB + RC + ID + CSG + CFP
			)
		})
	})

	describe('Pour les domiciliations fiscales à l’étranger', () => {
		const defaultSituationDFE = {
			...defaultSituation,
			"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
		}

		it('applique les assiettes forfaitaires, la dispense de CSG-CRDS et le taux maladie spécifique', () => {
			const e = engine.setSituation(defaultSituationDFE)

			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number
			const assietteForfaitaire = Math.round((PASSProratisé * 19) / 100)

			expect(e).toBeApplicable(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité . domiciliation fiscale étranger'
			)

			/** Cotisation maladie:
			 * assiette = 19% du PASS
			 * taux = 14,5%
			 */
			const AM = Math.round((assietteForfaitaire * 14.5) / 100)

			/** CSG-CRDS :
			 * exonération totale
			 * => 0 €
			 */

			// Le reste est identique à "Pour les A/C/PLNR > applique les assiettes forfaitaires au calcul des cotisations et contributions"

			/** Cotisation indemnités journalières :
			 * assiette = 40% du PASS (non proratisé)
			 * taux = 0,5%
			 * => 94 €
			 */
			const IJ = Math.round((Math.round((PASS * 40) / 100) * 0.5) / 100)

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette = 19% du PASS proratisé
			 * tranche 2 = 0 €
			 * taux tranche 1 = 17,87%
			 * tranche 2 = 0 (assiette < PASS proratisé)
			 */
			const RB = Math.round((assietteForfaitaire * 17.87) / 100)

			/** Cotisation retraite complémentaire :
			 * assiette = 19% du PASS proratisé
			 * tranche 2 = 0 €
			 * taux tranche 1 = 8,1%
			 */
			const RC = Math.round((assietteForfaitaire * 8.1) / 100)

			/** Cotisation invalidité-décès :
			 * assiette = 19% du PASS proratisé
			 * taux = 1,3%
			 */
			const ID = Math.round((assietteForfaitaire * 1.3) / 100)

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * assiette = PASS
			 * taux = 0,25%
			 */
			const CFP = Math.round((PASS * 0.25) / 100)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				AM + IJ + RB + RC + ID + CFP
			)
		})

		it('applique les assiettes forfaitaires, la dispense de CSG-CRDS et le taux maladie spécifique pour les PAMC', () => {
			const e = engine.setSituation({
				...defaultSituationDFE,
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
				'indépendant . profession libérale . réglementée . métier':
					"'santé . sage-femme'",
			})

			const PASSProratisé = e.evaluate('indépendant . PSS proratisé')
				.nodeValue as number
			const assietteForfaitaire = Math.round((PASSProratisé * 19) / 100)

			/** Cotisation maladie:
			 * assiette = 19% du PASS
			 * taux = 0,1% (après participation CPAM)
			 */
			const AM = Math.round((assietteForfaitaire * 0.1) / 100)

			/** CSG-CRDS :
			 * exonération totale
			 * => 0 €
			 */

			// Le reste est identique à "Pour les PLR > applique les assiettes forfaitaires au calcul des cotisations et contributions"

			/** Cotisation indemnités journalières :
			 * assiette = 40% du PASS (non proratisé)
			 * taux = 0,3%
			 * => 94 €
			 */
			const IJ = Math.round((Math.round((PASS * 40) / 100) * 0.3) / 100)

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette = 19% du PASS proratisé
			 * taux tranche 1 = 8,731%
			 * taux tranche 2 = 1,87%
			 * tranche 2 = 0 (assiette < PASS proratisé)
			 */
			const RB =
				Math.round((assietteForfaitaire * 8.73) / 100) +
				Math.round((assietteForfaitaire * 1.87) / 100)

			const RC = e.evaluate({
				valeur:
					'indépendant . profession libérale . réglementée . CARCDSF . retraite complémentaire',
				contexte: {
					'indépendant . cotisations et contributions . assiette sociale':
						'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				},
			}).nodeValue as number
			const ID = e.evaluate(
				'indépendant . profession libérale . réglementée . CARCDSF . sage-femme . RID'
			).nodeValue as number
			const PCV = e.evaluate({
				valeur:
					'indépendant . profession libérale . réglementée . CARCDSF . sage-femme . PCV',
				contexte: {
					'indépendant . cotisations et contributions . assiette sociale':
						'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				},
			}).nodeValue as number

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * assiette = PASS
			 * taux = 0,25%
			 */
			const CFP = Math.round((PASS * 0.25) / 100)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				AM + IJ + RB + RC + ID + PCV + CFP
			)
		})
	})
})
