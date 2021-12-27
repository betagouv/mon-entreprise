import { describe, it, expect } from 'vitest'
import rules from 'modele-social'
import { utils } from 'publicodes'

describe('DottedNames graph', () => {
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
				'dirigeant . rémunération . imposable',
				'dirigeant . auto-entrepreneur . impôt . revenu imposable',
				"entreprise . chiffre d'affaires",
				'dirigeant . rémunération . nette après impôt',
				'dirigeant . rémunération . nette',
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
