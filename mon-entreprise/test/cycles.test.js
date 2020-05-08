<<<<<<< HEAD:mon-entreprise/test/cycles.test.js
import { parseRules, buildRulesDependencies } from 'publicodes'
=======
import graphlib from '@dagrejs/graphlib'
import { expect } from 'chai'
import { buildRulesDependencies } from 'Engine/cyclesLib'
import parseRules from 'Engine/parseRules'
>>>>>>> cde4da75... WIP ⚙️ Detect cycles: test for cycles using @dagrejs/graphlib:test/cycles.test.js
import rules from 'Rules'

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
