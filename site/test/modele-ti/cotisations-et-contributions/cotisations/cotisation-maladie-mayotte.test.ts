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

	it('applique un taux de 4,20% aux A/C/PLNR', () => {
		const e = engine.setSituation(defaultSituation)

		expect(e).toEvaluate(COTISATION, Math.round((60_000 * 4.2) / 100))
	})

	it('applique un taux de 4,20% aux PLR', () => {
		const e = engine.setSituation({
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		})

		expect(e).toEvaluate(COTISATION, Math.round((60_000 * 4.2) / 100))
	})
})
