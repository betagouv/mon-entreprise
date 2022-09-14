import rules from 'modele-social'
import { utils } from 'publicodes'
import { describe, expect, it } from 'vitest'

// We skip static cycle test, as it does not separates applicability dependencies from value dependencies.
// The previous version was not handling cycle from applicability at all
// We may need a better algorithm for static cycle detection. But it's not a priority as there is a now a
// functionning cycle detection at runtime

describe.skip('DottedNames graph', () => {
	it("shouldn't have cycles", () => {
		const [cyclesDependencies, dotGraphs] = utils.cyclicDependencies(rules)

		const dotGraphsToLog = dotGraphs
			.map(
				(dotGraph) =>
					`🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀🌀\n A cycle graph to stare at with Graphviz:\n${dotGraph}\n\n`
			)
			.join('\n\n')

		expect(
			cyclesDependencies,
			`${dotGraphsToLog}\nAT LEAST the following cycles have been found in the rules dependencies graph.\nSee below for a representation of each cycle.\n⬇️  is a node of the cycle.\n\t- ${cyclesDependencies
				.map(
					(cycleDependencies, idx) =>
						'#' + idx + ':\n\t\t⬇️  ' + cycleDependencies.join('\n\t\t⬇️  ')
				)
				.join('\n\t- ')}\n\n`
		).to.deep.equal([
			[
				'dirigeant . rémunération . net . imposable',
				'dirigeant . auto-entrepreneur . impôt . revenu imposable',
				"entreprise . chiffre d'affaires",
				'dirigeant . rémunération . net . après impôt',
				'dirigeant . rémunération . net',
				'dirigeant . rémunération . totale',
				'impôt . montant',
				'impôt . revenu imposable',
			],
		])
		console.warn(
			"[ WARNING ] A cycle still exists around `entreprise . chiffre d'affaires` see issue #1524 for a definitive fix."
		)
	})
})
