import graphlib from '@dagrejs/graphlib'
import { expect } from 'chai'
import { buildRulesDependencies, parseRules } from 'publicodes'
import rules from '../source/rules'

describe('DottedNames graph', () => {
	it("shouldn't have cycles", () => {
		// debugger
		let parsedRules = parseRules(rules)
		let ruleDependencies = buildRulesDependencies(parsedRules)

		// console.log(ruleDependencies)
		let g = new graphlib.Graph()

		ruleDependencies.forEach(([ruleDottedName, dependenciesDottedNames]) => {
			dependenciesDottedNames.forEach(depDottedName => {
				g.setEdge(ruleDottedName, depDottedName)
			})
		})
		const cycles = graphlib.alg.findCycles(g)

		expect(
			cycles,
			`\nThe following rules have cycles:\n\t- ${cycles
				.map(x => x[0])
				.join('\n\t- ')}\n\n`
		).to.be.an('array').that.is.empty
	})
})
