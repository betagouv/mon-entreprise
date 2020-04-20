import { parseRules, buildRulesDependencies } from 'publicodes'
import rules from 'Rules'

describe('Graph', () => {
	it('should get a graph', () => {
		let parsedRules = parseRules(rules)
		let ruleDependencies = buildRulesDependencies(parsedRules)
		console.log(ruleDependencies)
	})
})
