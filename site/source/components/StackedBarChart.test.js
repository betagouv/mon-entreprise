import { expect, describe, it } from 'vitest'
import { roundedPercentages } from './StackedBarChart'

describe('roundedPercentages', () => {
	it('rounds percentages correctly', () => {
		expect(roundedPercentages([500, 250, 250], 1)).to.deep.equal([50, 25, 25])
		expect(roundedPercentages([501, 251, 248], 1)).to.deep.equal([50, 25, 25])
		expect(roundedPercentages([506, 257, 237], 1)).to.deep.equal([50, 26, 24])
		expect(roundedPercentages([509, 259, 232], 1)).to.deep.equal([51, 26, 23])
		expect(roundedPercentages([503, 253, 244], 1)).to.deep.equal([50, 25, 25])
	})
	it('rounds permilles correctly', () => {
		expect(roundedPercentages([5000, 2500, 2500], 0.1)).to.deep.equal([
			50.0, 25.0, 25.0,
		])
		expect(roundedPercentages([5001, 2507, 2492], 0.1)).to.deep.equal([
			50.0, 25.1, 24.9,
		])
		expect(roundedPercentages([5004, 2504, 2492], 0.1)).to.deep.equal([
			50.0, 25.1, 24.9,
		])
		expect(roundedPercentages([5005, 2503, 2492], 0.1)).to.deep.equal([
			50.1, 25.0, 24.9,
		])
		expect(roundedPercentages([5003, 2503, 2494], 0.1)).to.deep.equal([
			50.0, 25.0, 25.0,
		])
		expect(roundedPercentages([5004, 2503, 2493], 0.1)).to.deep.equal([
			50.1, 25.0, 24.9,
		])
	})
})
