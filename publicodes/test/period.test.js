import { expect } from 'chai'
import {
	concatTemporals,
	createTemporalEvaluation,
	groupByYear,
	zipTemporals
} from '../source/temporal'

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

describe('Periods : groupByYear', () => {
	const invariants = temporalYear => {
		const startDate = temporalYear[0].start
		const endDate = temporalYear.slice(-1)[0].end
		expect(
			startDate === null || startDate.startsWith('01/01'),
			'starts at the beginning of a year'
		)
		expect(
			endDate === null || endDate.startsWith('31/12'),
			'stops at the end of a year'
		)
	}
	it('should handle constant value', () => {
		const value = createTemporalEvaluation(10)
		expect(groupByYear(value)).to.deep.equal([value])
	})
	it('should handle changing value', () => {
		const value = createTemporalEvaluation(10, {
			start: '06/06/2020',
			end: '20/12/2020'
		})
		const result = groupByYear(value)
		expect(result).to.have.length(3)
		result.forEach(invariants)
	})
	it('should handle changing value over several years', () => {
		const value = createTemporalEvaluation(10, {
			start: '06/06/2020',
			end: '20/12/2022'
		})
		const result = groupByYear(value)
		expect(result).to.have.length(5)
		result.forEach(invariants)
	})
	it('should handle complex case', () => {
		const result = groupByYear(
			concatTemporals([
				createTemporalEvaluation(1, {
					start: '06/06/2020',
					end: '20/12/2022'
				}),
				createTemporalEvaluation(2, {
					start: '01/01/1991',
					end: '20/12/1992'
				}),
				createTemporalEvaluation(3, {
					start: '31/01/1990',
					end: '20/12/2021'
				}),
				createTemporalEvaluation(4, {
					start: '31/12/2020',
					end: '01/01/2021'
				})
			])
		)
		result.forEach(invariants)
	})
})
