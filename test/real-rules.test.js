import { AssertionError } from 'chai'
import Engine, { parseRules } from 'Engine'
import { disambiguateRuleReference } from 'Engine/ruleUtils'
import rules from 'Rules'

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
let parsedRules = parseRules(rules)
const engine = new Engine({ rules: parsedRules })
let runExamples = (examples, rule) =>
	examples.map(ex => {
		const expected = ex['valeur attendue']
		const situation = Object.entries(ex.situation).reduce(
			(acc, [name, value]) => ({
				...acc,
				[disambiguateRuleReference(parsedRules, rule.dottedName, name)]: value
			}),
			{}
		)
		const evaluation = engine
			.setSituation(situation)
			.setDefaultUnits(
				ex['unités par défaut'] ?? [rule['unité par défaut'] ?? '€/mois']
			)
			.evaluate(rule.dottedName)
		const ok =
			evaluation.nodeValue === expected
				? true
				: typeof expected === 'number'
				? Math.abs((evaluation.nodeValue - expected) / expected) < 0.001
				: false

		return { ...ex, ok, rule: evaluation }
	})

describe('Tests des règles de notre base de règles', () =>
	Object.values(parsedRules).map(rule => {
		if (!rule?.exemples) return null
		describe(rule.dottedName, () => {
			let examples = runExamples(rule.exemples, rule)
			examples.map(example =>
				it(example.nom + '', () => {
					if (!example.ok) {
						throw new AssertionError(`
						Valeur attendue : ${example['valeur attendue']}
						Valeur obtenue : ${example.rule.nodeValue} 
						${
							example.rule.nodeValue === null
								? 'Variables manquantes : ' +
								  JSON.stringify(example.rule.missingVariables, null, 4)
								: ''
						}
            `)
					}
				})
			)
		})
	}))
