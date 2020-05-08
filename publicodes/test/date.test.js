import { expect } from 'chai'
import { getDifferenceInMonths } from '../source/date'

describe('Date : getDifferenceInMonths', () => {
	it('should compute the difference for one full month', () => {
		expect(getDifferenceInMonths('01/01/2020', '31/01/2020')).to.equal(1)
	})
	it('should compute the difference for one month and one day', () => {
		expect(getDifferenceInMonths('01/01/2020', '01/02/2020')).to.equal(
			1 + 1 / 29
		)
	})
	it('should compute the difference for 2 days between months', () => {
		expect(getDifferenceInMonths('31/01/2020', '01/02/2020')).to.approximately(
			1 / 31 + 1 / 29,
			0.000000000001
		)
	})
})
