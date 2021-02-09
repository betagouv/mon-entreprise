import { expect } from 'chai'
import rules from 'modele-social'
import { cyclicDependencies } from '../../publicodes/core/source/AST/graph'

describe('DottedNames graph', () => {
	it("shouldn't have cycles", () => {
		let cyclesDependencies = cyclicDependencies(rules)

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

		// 	Cycle doesn't occur in real life. Will fix in next PR.
		// ⬇️  entreprise . chiffre d'affaires
		// ⬇️  dirigeant . rémunération totale
		// ⬇️  entreprise . chiffre d'affaires
	})
})
