import { AssertionError } from 'chai'
import { parseRules } from 'Engine'
import rules from 'Publicode/rules'
import { merge } from 'ramda'
import { exampleAnalysisSelector } from 'Selectors/analyseSelectors'

// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
let runExamples = (examples, rule) =>
	examples.map(ex => {
		let runExample = exampleAnalysisSelector(
				{
					rules,
					currentExample: {
						situation: ex.situation,
						dottedName: rule.dottedName,
						defaultUnits: ex['unités par défaut']
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

let parsedRules = parseRules(rules)
describe('Tests des règles de notre base de règles', () =>
	Object.values(parsedRules).map(rule => {
		if (!rule.exemples) return null
		describe(rule.dottedName, () => {
			let examples = runExamples(rule.exemples, rule)
			examples.map(example =>
				it(example.nom + '', () => {
					if (!example.ok)
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
				})
			)
		})
	}))
