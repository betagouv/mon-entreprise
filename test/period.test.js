import { expect } from 'chai'
import {
	concatTemporals,
	createTemporalEvaluation,
	zipTemporals
} from '../source/engine/period'

const neverEnding = value => [{ start: null, end: null, value: value }]
describe('Periods : zip', () => {
	it('should zip two empty temporalValue', () => {
		const result = zipTemporals([], [])
		expect(result).to.deep.equal([])
	})

	it('should zip constant temporalValue', () => {
		const result = zipTemporals(neverEnding(1), neverEnding(2))
		expect(result).to.deep.equal(neverEnding([1, 2]))
	})

	it('should zip changing temporalValue', () => {
		const value1 = createTemporalEvaluation(true, {
			start: null,
			end: '01/08/2020'
		})
		const value2 = neverEnding(1)
		expect(zipTemporals(value1, value2)).to.deep.equal([
			{ start: null, end: '01/08/2020', value: [true, 1] },
			{ start: '02/08/2020', end: null, value: [false, 1] }
		])
		expect(zipTemporals(value2, value1)).to.deep.equal([
			{ start: null, end: '01/08/2020', value: [1, true] },
			{ start: '02/08/2020', end: null, value: [1, false] }
		])
	})

	it('should zip two overlapping temporalValue', () => {
		const value1 = createTemporalEvaluation(1, {
			start: '01/07/2019',
			end: '30/06/2020'
		})
		const value2 = createTemporalEvaluation(2, {
			start: '01/01/2019',
			end: '31/12/2019'
		})

		expect(zipTemporals(value1, value2)).to.deep.equal([
			{ start: null, end: '31/12/2018', value: [false, false] },
			{ start: '01/01/2019', end: '30/06/2019', value: [false, 2] },
			{ start: '01/07/2019', end: '31/12/2019', value: [1, 2] },
			{ start: '01/01/2020', end: '30/06/2020', value: [1, false] },
			{ start: '01/07/2020', end: null, value: [false, false] }
		])
	})
})

describe('Periods : concat', () => {
	it('should merge concat overlapping temporalValue', () => {
		const value1 = createTemporalEvaluation(10)
		const value2 = [
			{ start: null, end: '14/04/2019', value: 100 },
			{ start: '15/04/2019', end: '08/08/2019', value: 2000 },
			{ start: '09/08/2019', end: null, value: 200 }
		]

		expect(concatTemporals([value1, value2])).to.deep.equal([
			{ start: null, end: '14/04/2019', value: [10, 100] },
			{ start: '15/04/2019', end: '08/08/2019', value: [10, 2000] },
			{ start: '09/08/2019', end: null, value: [10, 200] }
		])
	})
})
