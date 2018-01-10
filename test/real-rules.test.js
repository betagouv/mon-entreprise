/*
  Les mécanismes sont testés dans mécanismes/ comme le sont les variables directement dans la base YAML.
  On y créée dans chaque fichier une base YAML autonome, dans laquelle intervient le mécanisme à tester,
  puis on teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import { expect, AssertionError } from 'chai'
import { enrichRule, rules } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'
import { collectMissingVariables } from '../source/engine/generateQuestions'
import testSuites from './load-mecanism-tests'
import R from 'ramda'
import { runExamples, isFloat } from '../source/components/rule/Examples'

let parsedRules = parseAll(rules)

describe('Tests des règles de notre base de règles', () =>
	parsedRules.map(rule => {
		if (!rule.exemples) return null
		describe(rule.name, () => {
			let examples = runExamples(rule.exemples, rule, parsedRules)
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
