import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'établissement . commune . département': "'Mayotte'",
	'entreprise . imposition': "'IS'",
	'indépendant . rémunération . brute': '50000 €/an',
}

describe('l’exonération 24 mois Mayotte', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('est applicable pour les établissements mahorais créés il y a moins de 2 ans', () => {
		const e = engine.setSituation({
			date: '01/01/2026',
			'établissement . commune . département': "'Mayotte'",
			'entreprise . date de création': '01/02/2024',
		})

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Mayotte 24 mois',
			true
		)
	})

	it('n’est pas applicable pour les établissements non mahorais créés il y a moins de 2 ans', () => {
		const e = engine.setSituation({
			date: '01/01/2026',
			'entreprise . date de création': '01/02/2024',
		})

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Mayotte 24 mois',
			false
		)
	})

	it('n’est pas applicable pour les établissements mahorais créés il y a plus de 2 ans', () => {
		const e = engine.setSituation({
			date: '01/01/2026',
			'entreprise . date de création': '01/01/2024',
		})

		expect(e).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Mayotte 24 mois',
			false
		)
	})

	it('n’est pas applicable pour les établissements non mahorais créés il y a plus de 2 ans', () => {
		expect(engine).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . exonérations . Mayotte 24 mois',
			false
		)
	})

	it('exonère totalement les cotisations maladie, allocations familiales et retraite de base des A/C/PLNR', () => {
		const e1 = engine.setSituation(defaultSituation)

		const cotisationsEtContributions = e1.evaluate(
			'indépendant . cotisations et contributions'
		).nodeValue as number
		const maladie1 = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité-invalidité-décès-autonomie'
		).nodeValue as number
		const maladie2 = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie'
		).nodeValue as number
		const AF = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . allocations familiales'
		).nodeValue as number
		const RB = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . retraite de base'
		).nodeValue as number

		const e2 = engine.setSituation({
			...defaultSituation,
			'entreprise . date de création': '01/01/2026',
		})

		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité-invalidité-décès-autonomie',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . allocations familiales',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . retraite de base',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions',
			cotisationsEtContributions - maladie1 - maladie2 - AF - RB
		)
	})

	it('exonère totalement les cotisations maladie et allocations familiales des PLR Cipav', () => {
		const situation = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		const e1 = engine.setSituation(situation)

		const cotisationsEtContributions = e1.evaluate(
			'indépendant . cotisations et contributions'
		).nodeValue as number
		const maladie1 = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité-invalidité-décès-autonomie'
		).nodeValue as number
		const maladie2 = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie'
		).nodeValue as number
		const AF = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . allocations familiales'
		).nodeValue as number
		const RB = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . retraite de base'
		).nodeValue as number

		const e2 = engine.setSituation({
			...situation,
			'entreprise . date de création': '01/01/2026',
		})

		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité-invalidité-décès-autonomie',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . allocations familiales',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . retraite de base',
			RB
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions',
			cotisationsEtContributions - maladie1 - maladie2 - AF
		)
	})

	it('exonère totalement les cotisations maladie et allocations familiales des PLR hors Cipav', () => {
		const situation = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . profession libérale . réglementée . métier':
				"'expert-comptable'",
		}

		const e1 = engine.setSituation(situation)

		const cotisationsEtContributions = e1.evaluate(
			'indépendant . cotisations et contributions'
		).nodeValue as number
		const maladie1 = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité-invalidité-décès-autonomie'
		).nodeValue as number
		const maladie2 = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie'
		).nodeValue as number
		const AF = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . allocations familiales'
		).nodeValue as number
		const RB = e1.evaluate(
			'indépendant . cotisations et contributions . cotisations . retraite de base'
		).nodeValue as number

		const e2 = engine.setSituation({
			...situation,
			'entreprise . date de création': '01/01/2026',
		})

		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité-invalidité-décès-autonomie',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . allocations familiales',
			0
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions . cotisations . retraite de base',
			RB
		)
		expect(e2).toEvaluate(
			'indépendant . cotisations et contributions',
			cotisationsEtContributions - maladie1 - maladie2 - AF
		)
	})
})
