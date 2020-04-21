import { parseRules, buildRulesDependencies } from 'publicodes'
import rules from 'Rules'

describe('Graph', () => {
	it('should get a graph', () => {
		debugger // Keep this for allowing deactivating other debugger statements via the Chrome inspector
		let parsedRules = parseRules(rules)
		let ruleDependencies = buildRulesDependencies(parsedRules)
		console.log(ruleDependencies)
	})
})
