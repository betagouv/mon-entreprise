import { expect } from 'chai'
import {
	concatTemporalValues,
	createTemporalValue,
	mergeTemporalValuesWith
} from '../source/engine/period'

const neverEnding = value => [{ start: null, end: null, value: value }]
describe('Periods : concat', () => {
	it('should concat two empty temporalValue', () => {
		const result = concatTemporalValues([], [])
		expect(result).to.deep.equal([])
	})

	it('should concat constant never-ending temporalValue', () => {
		const result = concatTemporalValues(neverEnding(1), neverEnding(2))
		expect(result).to.deep.equal(neverEnding([1, 2]))
	})

	it('should concat changing never-ending temporalValue', () => {
		const value1 = createTemporalValue(true, { start: null, end: '01/08/2020' })
		const value2 = neverEnding(1)
		expect(concatTemporalValues(value1, value2)).to.deep.equal([
			{ start: null, end: '01/08/2020', value: [true, 1] },
			{ start: '02/08/2020', end: null, value: [false, 1] }
		])
		expect(concatTemporalValues(value2, value1)).to.deep.equal([
			{ start: null, end: '01/08/2020', value: [1, true] },
			{ start: '02/08/2020', end: null, value: [1, false] }
		])
	})

	it('should concat two overlapping never-ending temporalValue', () => {
		const value1 = createTemporalValue(1, {
			start: '01/07/2019',
			end: '30/06/2020'
		})
		const value2 = createTemporalValue(2, {
			start: '01/01/2019',
			end: '31/12/2019'
		})

		expect(concatTemporalValues(value1, value2)).to.deep.equal([
			{ start: null, end: '31/12/2018', value: [false, false] },
			{ start: '01/01/2019', end: '30/06/2019', value: [false, 2] },
			{ start: '01/07/2019', end: '31/12/2019', value: [1, 2] },
			{ start: '01/01/2020', end: '30/06/2020', value: [1, false] },
			{ start: '01/07/2020', end: null, value: [false, false] }
		])
	})
})

describe('Periods : merge', () => {
	it('should merge two overlapping never-ending temporalValue', () => {
		const value1 = createTemporalValue(10)
		const value2 = [
			{ start: null, end: '14/04/2019', value: 100 },
			{ start: '15/04/2019', end: '08/08/2019', value: 2000 },
			{ start: '09/08/2019', end: null, value: 200 }
		]

		expect(
			mergeTemporalValuesWith((a, b) => a + b, value1, value2)
		).to.deep.equal([
			{ start: null, end: '14/04/2019', value: 110 },
			{ start: '15/04/2019', end: '08/08/2019', value: 2010 },
			{ start: '09/08/2019', end: null, value: 210 }
		])
	})
})
