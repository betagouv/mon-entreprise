import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const COTISATION =
	'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie'

const defaultSituation = {
	'établissement . commune . département': "'Mayotte'",
	'indépendant . cotisations et contributions . assiette sociale': '60000 €/an',
}

describe('Cotisation additionnelle d’assurance maladie-maternité et autonomie', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('n’est pas redevable par les non mahorais', () => {
		expect(engine).not.toBeApplicable(COTISATION)
	})

	it('applique un abattement de 50% à l’assiette sociale si elle est inférieure au Pass mahorais', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'indépendant . cotisations et contributions . assiette sociale':
				'35000 €/an',
		})

		expect(e).toEvaluate(`${COTISATION} . assiette`, 35_000 / 2)
	})

	it('applique un abattement valant 50% du Pass mahorais à l’assiette sociale si elle est supérieure au Pass mahorais', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'indépendant . cotisations et contributions . assiette sociale':
				'40000 €/an',
		})
		const Pass = e.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number

		expect(e).toEvaluate(
			`${COTISATION} . assiette`,
			40_000 - Math.round(Pass / 2)
		)
	})

	it('applique un taux de 4,20%', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'indépendant . cotisations et contributions . cotisations . maladie-maternité et autonomie . assiette':
				'30000 €/an',
		})

		expect(e).toEvaluate(COTISATION, Math.round((30_000 * 4.2) / 100))
	})
})
