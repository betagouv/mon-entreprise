import { describe, expect, it } from 'vitest'
import Engine, { parsePublicodes } from 'publicodes'
import { utils } from 'publicodes'
import rules from 'modele-social'

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
let parsedRules = parsePublicodes(rules)
const engine = new Engine(rules)
let runExamples = (examples, rule) =>
	examples.map((ex) => {
		const expected = ex['valeur attendue']
		const situation = Object.entries(ex.situation).reduce(
			(acc, [name, value]) => ({
				...acc,
				[utils.disambiguateRuleReference(
					engine.parsedRules,
					rule.dottedName,
					name
				)]: value,
			}),
			{}
		)
		const evaluation = engine
			.setSituation(situation)
			.evaluate(rule.dottedName, {
				unit: rule['unité par défaut'],
			})
		const ok =
			evaluation.nodeValue === expected
				? true
				: typeof expected === 'number'
				? Math.abs((evaluation.nodeValue - expected) / expected) < 0.001
				: false

		return { ...ex, ok, rule: evaluation }
	})

describe('Tests des règles de notre base de règles', () =>
	Object.values(parsedRules)
		.filter((rule) => rule.rawNode.exemples)
		.map((rule) => {
			describe(rule.dottedName, () => {
				let examples = runExamples(rule.rawNode.exemples, rule)
				examples.map((example) =>
					it('calculate example ' + example.nom, () => {
						if (example.ok) {
							if (typeof example['valeur attendue'] === 'number') {
								expect(example.rule.nodeValue).to.be.closeTo(
									example['valeur attendue'],
									0.01
								)
							} else {
								expect(example.rule.nodeValue).to.be.equal(
									example['valeur attendue']
								)
							}
						}
					})
				)
			})
		}))
