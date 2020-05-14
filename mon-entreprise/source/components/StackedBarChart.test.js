import { expect } from 'chai'
import { roundedPercentages } from './StackedBarChart'

describe('roundedPercentages', () => {
	it('rounds correctly', () => {
		expect(roundedPercentages([500, 250, 250])).to.deep.equal([50, 25, 25])
		expect(roundedPercentages([501, 251, 248])).to.deep.equal([50, 25, 25])
		expect(roundedPercentages([506, 257, 237])).to.deep.equal([50, 26, 24])
		expect(roundedPercentages([509, 259, 232])).to.deep.equal([51, 26, 23])
		expect(roundedPercentages([503, 253, 244])).to.deep.equal([50, 25, 25])
	})
})
