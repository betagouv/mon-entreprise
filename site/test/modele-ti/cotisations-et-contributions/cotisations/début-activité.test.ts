import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
	"entreprise . chiffre d'affaires": '10000 €/an',
	'entreprise . date de création': '18/02/2026',
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
		const defaultSituationDFE = {
			...defaultSituation,
			"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
		}

		it('applique les assiettes forfaitaires, la dispense de CSG-CRDS et le taux maladie spécifique', () => {
			const e = engine.setSituation(defaultSituationDFE)

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)
			expect(e).toBeApplicable(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité . domiciliation fiscale étranger'
			)

			/** Cotisation maladie:
			 * assiette forfaitaire = 19% du PASS = 7 772 €
			 * assiette forfaitaire x taux spécifique = 7 772 € x 14,5%
			 * => 1 127 €
			 */

			/** CSG-CRDS :
			 * exonération totale
			 * => 0 €
			 */

			// Le reste est identique à "Pour les A/C/PLNR > applique les assiettes forfaitaires au calcul des cotisations et contributions"

			/** Cotisation indemnités journalières :
			 * assiette forfaitaire = 40% du PASS (non proratisé) = 18 840 €
			 * assiette forfaitaire x taux = 18 840 € x 0,5%
			 * => 94 €
			 */

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => 0 €
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
				1127 + 94 + 1389 + 630 + 101 + 118
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

			expect(e).toEvaluate('indépendant . PSS proratisé', 40906)

			/** Cotisation maladie:
			 * assiette forfaitaire = 19% du PASS = 7 772 €
			 * assiette forfaitaire x taux spécifique - participation CPAM = assiette forfaitaire x 0,10% = 7 772 € x 0,10%
			 * => 8 €
			 */
			const maladieMaternité = 8

			/** CSG-CRDS :
			 * exonération totale
			 * => 0 €
			 */

			// Le reste est identique à "Pour les PLR > applique les assiettes forfaitaires au calcul des cotisations et contributions"

			/** Cotisation indemnités journalières :
			 * assiette forfaitaire = 40% du PASS (non proratisé) = 18 840 €
			 * assiette forfaitaire x taux = 18 840 € x 0,3%
			 * => 57 €
			 */
			const IJ = 57

			/** Cotisation allocations familiales :
			 * assiette forfaitaire = 19% du PASS
			 * assiette forfaitaire < 1er plafond (110% du PASS)
			 * => 0 €
			 */

			/** Cotisation retraite de base :
			 * assiette forfaitaire = 19% du PASS proratisé = 7 772 €
			 * assiette forfaitaire > assiette minimale (450h x Smic = 5 346€)
			 * tranche 1 = assiette forfaitaire x taux tranche 1 = 7 772 € x 8,73% = 678 €
			 * tranche 2 = assiette forfaitaire x taux tranche 2 = 7 772 € x 1,87% = 145 €
			 * => 823 €
			 */
			const retraiteDeBase = 823

			const retraiteComplémentaire = e.evaluate({
				valeur:
					'indépendant . profession libérale . réglementée . CARCDSF . retraite complémentaire',
				contexte: {
					'indépendant . cotisations et contributions . assiette sociale':
						'indépendant . cotisations et contributions . début activité . assiette forfaitaire',
				},
			}).nodeValue as number
			const invaliditéDécès = e.evaluate(
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
			 * 0,25% x PASS = 0,25% x 47 100 €
			 * => 118 €
			 */
			const CFP = 118

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . début activité',
				maladieMaternité +
					IJ +
					retraiteDeBase +
					retraiteComplémentaire +
					invaliditéDécès +
					PCV +
					CFP
			)
		})
	})
})
