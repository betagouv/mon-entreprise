import { expect } from 'chai'
import { cyclesLib } from 'publicodes'
import rules from '../source/rules'

describe('DottedNames graph', () => {
	it("shouldn't have cycles", () => {
		let cyclesDependencies = cyclesLib.cyclicDependencies(rules)

		expect(
			cyclesDependencies,
			`\nThe cycles have been found in the rules dependencies graph.\nSee below for a representation of each cycle.\n⬇️  is a node of the cycle.\n\t- ${cyclesDependencies
				.map(
					(cycleDependencies, idx) =>
						'#' +
						idx +
						':\n\t\t⬇️  ' +
						cycleDependencies
							// .map(
							// 	([ruleName, dependencies]) =>
							// 		ruleName + '\n\t\t\t↘️  ' + dependencies.join('\n\t\t\t↘️  ')
							// )
							.join('\n\t\t⬇️  ')
				)
				.join('\n\t- ')}\n\n`
		)
			.to.be.an('array')
			.of.length(1)
		// We have one cycle that we are aware of, but that doesn't occur at runtime
		// see contrat salarié . activité partielle . indemnités . complémentaire
	})
})
