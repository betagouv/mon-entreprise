import { AssertionError } from 'chai'
import { merge } from 'ramda'
import { rules } from 'Règles'
import { exampleAnalysisSelector } from 'Selectors/analyseSelectors'
import { parseAll } from '../source/engine/traverse'

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
			exampleValue = runExample.value,
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
		describe(rule.dottedName, () => {
			let examples = runExamples(rule.exemples, rule)
			examples.map(example =>
				it(example.nom + '', () => {
					if (!example.ok)
						throw new AssertionError(`
              Valeur attendue : ${example['valeur attendue']}
			  Valeur obtenue : ${example.rule.value} 
			  ${
					example.rule.value === null
						? 'Variables manquantes : ' +
						  JSON.stringify(example.rule.missingVariables, null, 4)
						: ''
				}
            `)
				})
			)
		})
	}))
