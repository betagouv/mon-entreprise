import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
	"entreprise . chiffre d'affaires": '10000 €/an',
	'entreprise . date de création': '18/02/2025',
}

describe('Cotisations de début d’activité', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('Pour les A/C/PLNR', () => {
		it('applique une assiette forfaitaire égale à 19% du PASS proratisé', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				7772
			)
		})

		it('applique une assiette forfaitaire indemnités journalières égale à 40% du PASS non proratisé', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire indemnités journalières',
				18840
			)
		})

		it('applique les assiettes forfaitaires au calcul des cotisations et contributions', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)

			/** Cotisation maladie-maternité :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (20% du PASS)
			 * => taux nul
			 */

			/** Cotisation indemnités journalières :
			 * assiette forfaitaire = 40% du PASS (non proratisé) = 18 840 €
			 * assiette forfaitaire x taux = 18 840 € x 0,5%
			 * => 94 €
			 */

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (450h x Smic = 5 346€)
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 17,15% = 1 333 €
			 * tranche 2 = assiette forfaitaire x taux tranche 2 = 7 772 € x 0,72% = 56 €
			 * => 1 389 €
			 */

			/** Cotisation retraite complémentaire :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire < plafond tranche 1 (PASS proratisé)
			 * tranche 2 = 0 €
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 8,1% = 630 €
			 * => 630 €
			 */

			/** Cotisation invalidité-décès :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (11,5% du PASS proratisé)
			 * assiette forfaitaire < assiette maximale (PASS proratisé)
			 * assiette forfaitaire x taux = 7 772 € x 1,3%
			 * => 101 €
			 */

			/** CSG-CRDS :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire x taux = 7 772 € x 9,7%
			 * => 753 € (écart d'1 euro dû au calcul par étape en déductible + non déductible)
			 */

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * 0,25% x PASS = 0,25% x 47 100 €
			 * => 118 €
			 */

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				3085
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

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				7772
			)
		})

		it('applique une assiette forfaitaire indemnités journalières égale à 40% du PASS non proratisé', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire indemnités journalières',
				18840
			)
		})

		it('applique une assiette forfaitaire invalidité décès égale à 37% du PASS proratisé', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . assiette forfaitaire invalidité décès Cipav',
				15135
			)
		})

		it('applique les assiettes forfaitaires au calcul des cotisations et contributions', () => {
			const e = engine.setSituation(defaultSituationPLR)

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)

			/** Cotisation maladie-maternité :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (20% du PASS)
			 * => taux nul
			 */

			/** Cotisation indemnités journalières :
			 * assiette forfaitaire = 40% du PASS (non proratisé) = 18 840 €
			 * assiette forfaitaire x taux = 18 840 € x 0,3%
			 * => 57 €
			 */

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (450h x Smic = 5 346€)
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 8,73% = 678 €
			 * tranche 2 = assiette forfaitaire x taux tranche 2 = 7 772 € x 1,87% = 145 €
			 * => 823 €
			 */

			/** Cotisation retraite complémentaire :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire < plafond tranche 1 (PASS proratisé)
			 * tranche 2 = 0 €
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 11% = 855 €
			 * => 855 €
			 */

			/** Cotisation invalidité-décès :
			 * assiette forfaitaire = 37% du PASS proratisé = 15 135 €
			 * assiette forfaitaire > assiette minimale (11,5% du PASS proratisé)
			 * assiette forfaitaire < assiette maximale (PASS proratisé)
			 * assiette forfaitaire x taux = 15 135 € x 0,5%
			 * => 76 €
			 */

			/** CSG-CRDS :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire x taux = 7 772 € x 9,7%
			 * => 753 € (écart d'1 euro dû au calcul par étape en déductible + non déductible)
			 */

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * 0,25% x PASS = 0,25% x 47 100 €
			 * => 118 €
			 */

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				2682
			)
		})
	})

	describe('Pour les domiciliations fiscales à l’étranger', () => {
		it('applique les assiettes forfaitaires, la dispense de CSG-CRDS et le taux maladie spécifique', () => {
			const e = engine.setSituation({
				...defaultSituation,
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
			})

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)
			expect(e).toBeApplicable(
				'indépendant . cotisations et contributions . cotisations . maladie . domiciliation fiscale étranger'
			)

			/** Cotisation maladie (remplace maladie-maternité et indemnités journalières):
			 * assiette forfaitaire = 19% du PASS = 7 772 €
			 * assiette forfaitaire x taux spécifique = 7 772 € x 14,5%
			 * => 1 127 €
			 */

			/** CSG-CRDS :
			 * exonération totale
			 * => 0 €
			 */

			// Le reste est identique à "Pour les A/C/PLNR > applique les assiettes forfaitaires au calcul des cotisations et contributions"

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (450h x Smic = 5 346€)
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 17,15% = 1 333 €
			 * tranche 2 = assiette forfaitaire x taux tranche 2 = 7 772 € x 0,72% = 56 €
			 * => 1 389 €
			 */

			/** Cotisation retraite complémentaire :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire < plafond tranche 1 (PASS proratisé)
			 * tranche 2 = 0 €
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 8,1% = 630 €
			 * => 630 €
			 */

			/** Cotisation invalidité-décès :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (11,5% du PASS proratisé)
			 * assiette forfaitaire < assiette maximale (PASS proratisé)
			 * assiette forfaitaire x taux = 7 772 € x 1,3%
			 * => 101 €
			 */

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * 0,25% x PASS = 0,25% x 47 100 €
			 * => 118 €
			 */

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				3365
			)
		})

		// Ne passe pas à cause de https://github.com/betagouv/mon-entreprise/issues/4035
		it.skip('applique les assiettes forfaitaires, la dispense de CSG-CRDS mais les taux maladie normaux pour les PAMC', () => {
			const e = engine.setSituation({
				...defaultSituation,
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
				'indépendant . PL . métier': "'santé . sage-femme'",
			})

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)

			/** CSG-CRDS :
			 * exonération totale
			 * => 0 €
			 */

			expect(e).toEvaluate(
				'indépendant . PL . CNAVPL . retraite complémentaire',
				588
			)
			expect(e).toEvaluate(
				'indépendant . PL . CNAVPL . invalidité et décès',
				380
			)

			// Le reste est identique à "Pour les PLR > applique les assiettes forfaitaires au calcul des cotisations et contributions"

			/** Cotisation maladie-maternité :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (20% du PASS)
			 * => taux nul
			 */

			/** Cotisation indemnités journalières :
			 * assiette forfaitaire = 40% du PASS (non proratisé) = 18 840 €
			 * assiette forfaitaire x taux = 18 840 € x 0,3%
			 * => 57 €
			 */

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => taux nul
			 */

			/** Cotisation retraite de base :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (450h x Smic = 5 346€)
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 8,73% = 678 €
			 * tranche 2 = assiette forfaitaire x taux tranche 2 = 7 772 € x 1,87% = 145 €
			 * => 823 €
			 */

			/** CFP :
			 * pas d'assiette forfaitaire, pas de proratisation
			 * 0,25% x PASS = 0,25% x 47 100 €
			 * => 118 €
			 */

			expect(e).toEvaluate('indépendant . PL . PAMC', true)
			expect(e).not.toBeApplicable(
				'indépendant . cotisations et contributions . cotisations . maladie . domiciliation fiscale étranger'
			)
			expect(e).toBeApplicable(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			)
			expect(e).toBeApplicable(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . maladie-maternité',
				1
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . IJ',
				2
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité . maladie',
				3
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				1966
			)
		})
	})
})
