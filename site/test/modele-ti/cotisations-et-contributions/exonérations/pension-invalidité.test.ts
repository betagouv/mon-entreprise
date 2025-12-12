import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
	'indépendant . cotisations et contributions . assiette sociale': '50000 €/an',
}
const defaultSituationInvalidité = {
	...defaultSituation,
	'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité':
		'oui',
	'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité . durée':
		'9 mois',
}

describe('L’exonération invalidité', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('applique taux égal au prorata de la durée d’invalidité', () => {
		const e = engine.setSituation(defaultSituationInvalidité)

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité . exonération',
			75
		)
	})

	describe('pour les A/C/PLNR', () => {
		it('s’applique à la cotisation maladie-maternité', () => {
			const e1 = engine.setSituation(defaultSituation)
			const maladie = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationInvalidité)
			const maladieExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			).nodeValue as number

			expect(maladieExonérée).toEqual(Math.round(0.25 * maladie))
		})

		it('s’applique à la cotisation indemnités journalières', () => {
			const e1 = engine.setSituation(defaultSituation)
			const IJ = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationInvalidité)
			const IJExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			).nodeValue as number

			expect(IJExonérée).toEqual(Math.round(0.25 * IJ))
		})

		it('ne s’applique pas à la cotisation retraite de base', () => {
			const e1 = engine.setSituation(defaultSituation)
			const retraiteDeBase = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationInvalidité)
			const retraiteDeBaseInvalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			expect(retraiteDeBaseInvalidité).toEqual(retraiteDeBase)
		})

		it('s’applique à la cotisation retraite complémentaire', () => {
			const e1 = engine.setSituation(defaultSituation)
			const retraiteComplémentaire = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			const e2 = engine.setSituation(defaultSituationInvalidité)
			const retraiteComplémentaireExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			expect(retraiteComplémentaireExonérée).toEqual(
				Math.round(0.25 * retraiteComplémentaire)
			)
		})
	})

	describe('pour les PLR Cipav', () => {
		const situationCipav = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('s’applique à la cotisation maladie-maternité', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationCipav,
			})
			const maladie = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationCipav,
			})
			const maladieExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			).nodeValue as number

			expect(maladieExonérée).toEqual(Math.round(0.25 * maladie))
		})

		it('s’applique à la cotisation indemnités journalières', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationCipav,
			})
			const IJ = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationCipav,
			})
			const IJExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			).nodeValue as number

			expect(IJExonérée).toEqual(Math.round(0.25 * IJ))
		})

		it('s’applique à la cotisation retraite de base', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationCipav,
			})
			const retraiteDeBase = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationCipav,
			})
			const retraiteDeBaseExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			expect(retraiteDeBaseExonérée).toEqual(Math.round(0.25 * retraiteDeBase))
		})

		it('ne s’applique pas à la cotisation retraite de base si l’exonération incapacité CNAVPL est plus avantageuse', () => {
			const e = engine.setSituation({
				...defaultSituationInvalidité,
				...situationCipav,
				'indépendant . PL . CNAVPL . exonération incapacité': 'oui',
			})
			const retraiteDeBaseExonérée = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			expect(retraiteDeBaseExonérée).toEqual(0)
		})

		it('s’applique à la cotisation retraite complémentaire', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationCipav,
			})
			const retraiteComplémentaire = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationCipav,
			})
			const retraiteComplémentaireExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			expect(retraiteComplémentaireExonérée).toEqual(
				Math.round(0.25 * retraiteComplémentaire)
			)
		})

		it('ne s’applique pas à la cotisation retraite complémentaire si l’exonération incapacité CNAVPL est plus avantageuse', () => {
			const e = engine.setSituation({
				...defaultSituationInvalidité,
				...situationCipav,
				'indépendant . PL . CNAVPL . exonération incapacité': 'oui',
			})
			const retraiteComplémentaireExonérée = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			expect(retraiteComplémentaireExonérée).toEqual(0)
		})
	})

	describe('pour les PLR non Cipav', () => {
		const situationPLRNonCipav = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . PL . métier': "'expert-comptable'",
		}

		it('s’applique à la cotisation maladie-maternité', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationPLRNonCipav,
			})
			const maladie = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationPLRNonCipav,
			})
			const maladieExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . maladie-maternité'
			).nodeValue as number

			expect(maladieExonérée).toEqual(Math.round(0.25 * maladie))
		})

		it('s’applique à la cotisation indemnités journalières', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationPLRNonCipav,
			})
			const IJ = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationPLRNonCipav,
			})
			const IJExonérée = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie . indemnités journalières'
			).nodeValue as number

			expect(IJExonérée).toEqual(Math.round(0.25 * IJ))
		})

		it('ne s’applique pas à la cotisation retraite de base', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationPLRNonCipav,
			})
			const retraiteDeBase = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationPLRNonCipav,
			})
			const retraiteDeBaseInvalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number

			expect(retraiteDeBaseInvalidité).toEqual(retraiteDeBase)
		})

		it('ne s’applique pas à la cotisation retraite complémentaire', () => {
			const e1 = engine.setSituation({
				...defaultSituation,
				...situationPLRNonCipav,
			})
			const retraiteComplémentaire = e1.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			const e2 = engine.setSituation({
				...defaultSituationInvalidité,
				...situationPLRNonCipav,
			})
			const retraiteComplémentaireInvalidité = e2.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			expect(retraiteComplémentaireInvalidité).toEqual(retraiteComplémentaire)
		})
	})
})
