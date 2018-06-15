/*
  Les mécanismes sont testés dans mécanismes/ comme le sont les variables directement dans la base YAML.
  On y créée dans chaque fichier une base YAML autonome, dans laquelle intervient le mécanisme à tester,
  puis on teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import { AssertionError } from 'chai'
import { rules } from '../source/engine/rules'
import { parseAll } from '../source/engine/traverse'
import { exampleAnalysisSelector } from 'Selectors/analyseSelectors'
import { merge } from 'ramda'

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
let runExamples = (examples, rule) =>
	examples.map(ex => {
		let runExample = exampleAnalysisSelector(
				{
					currentExample: {
						situation: ex.situation,
						dottedName: rule.dottedName
					}
				},
				{ dottedName: rule.dottedName }
			),
			exampleValue = runExample.nodeValue,
			goal = ex['valeur attendue'],
			ok =
				exampleValue === goal
					? true
					: typeof goal === 'number'
						? Math.abs((exampleValue - goal) / goal) < 0.001
						: goal === null && exampleValue === 0

		return merge(ex, {
			ok,
			rule: runExample
		})
	})

let parsedRules = parseAll(rules)
describe('Tests des règles de notre base de règles', () =>
	parsedRules.map(rule => {
		if (!rule.exemples) return null
		describe(rule.name, () => {
			let examples = runExamples(rule.exemples, rule)
			examples.map(example =>
				it(example.nom + '', () => {
					if (!example.ok)
						throw new AssertionError(`
              Valeur attendue : ${example['valeur attendue']}
              Valeur obtenue : ${example.rule.nodeValue}
            `)
				})
			)
		})
	}))
