import { expect } from 'chai'
import { cyclicDependencies } from 'publicodes'
import rules from '../source/rules'

describe('DottedNames graph', () => {
	it("shouldn't have cycles", () => {
		let cycles = cyclicDependencies(rules)

		expect(
			cycles,
			`\nThe cycles have been found in the rules dependencies graph:\n\t- ${cycles
				.map((x, idx) => '#' + idx + ':\n\t\t- ' + x.join('\n\t\t- '))
				.join('\n\t- ')}\n\n`
		).to.be.an('array').that.is.empty
	})
})
