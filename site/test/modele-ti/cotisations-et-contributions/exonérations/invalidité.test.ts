import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'entreprise . imposition': "'IR'",
	'indépendant . cotisations et contributions . assiette sociale': '50000 €/an',
	'indépendant . cotisations et contributions . cotisations . exonérations . invalidité':
		'oui',
	'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
		'9 mois',
}

describe('L’exonération invalidité', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('applique un taux égal au prorata de la durée d’invalidité', () => {
		const e = engine.setSituation(defaultSituation)

		expect(e).toEvaluate(
			"indépendant . cotisations et contributions . cotisations . exonérations . invalidité . prorata sur l'année",
			75
		)
	})

	describe('pour les A/C/PLNR', () => {
		it('s’applique aux cotisations maladie-maternité, indemnités journalières et retraite complémentaire', () => {
			const e = engine.setSituation(defaultSituation)
			const maladie = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue as number
			const IJ = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue as number
			const retraiteComplémentaire = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . montant',
				Math.round(0.75 * (maladie + IJ + retraiteComplémentaire))
			)
		})
	})

	describe('pour les PLR Cipav', () => {
		const situationCipav = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('s’applique aux cotisations maladie-maternité, indemnités journalières, retraite de base et retraite complémentaire', () => {
			const e = engine.setSituation({
				...defaultSituation,
				...situationCipav,
			})
			const maladie = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue as number
			const IJ = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue as number
			const retraiteDeBase = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite de base'
			).nodeValue as number
			const retraiteComplémentaire = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . retraite complémentaire'
			).nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . montant',
				Math.round(
					0.75 * (maladie + IJ + retraiteDeBase + retraiteComplémentaire)
				)
			)
		})
	})

	describe('pour les PLR non Cipav', () => {
		const situationPLRNonCipav = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . profession libérale . réglementée . métier':
				"'expert-comptable'",
		}

		it('s’applique aux cotisations maladie-maternité et indemnités journalières', () => {
			const e = engine.setSituation({
				...defaultSituation,
				...situationPLRNonCipav,
			})
			const maladie = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . maladie-maternité'
			).nodeValue as number
			const IJ = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . indemnités journalières'
			).nodeValue as number

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . montant',
				Math.round(0.75 * (maladie + IJ))
			)
		})
	})
})
