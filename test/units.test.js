import { expect } from 'chai'
import { removeOnce, parseUnit, inferUnit } from 'Engine/units'

describe('Units', () => {
	it('should remove the first element encounter in the list', () => {
		let result = removeOnce(4)([1, 4, 6, 5, 4])
		expect(result).to.deep.equal([1, 6, 5, 4])
	})
	it('should parse string units into object', () => {
		expect(parseUnit('m')).to.deep.equal({
			numerators: ['m'],
			denominators: []
		})
		expect(parseUnit('m/s')).to.deep.equal({
			numerators: ['m'],
			denominators: ['s']
		})
	})
	it('should work with simple use case *', () => {
		let unit1 = { numerators: ['m'], denominators: ['s'] }
		let unit2 = { numerators: ['s'], denominators: [] }
		let unit = inferUnit('*', [unit1, unit2])

		expect(unit).to.deep.equal({
			numerators: ['m'],
			denominators: []
		})
	})
	it('should work with simple use case / ', () => {
		let unit1 = { numerators: ['m'], denominators: ['s'] }
		let unit2 = { numerators: ['m'], denominators: [] }
		let unit = inferUnit('/', [unit1, unit2])

		expect(unit).to.deep.equal({
			numerators: [],
			denominators: ['s']
		})
	})
	it('should work with advanced use case /', () => {
		let unit1 = { numerators: ['a', 'b', 'a', 'z'], denominators: ['c'] }
		let unit2 = { numerators: ['a', 'e', 'f'], denominators: ['z', 'c'] }
		let unit = inferUnit('/', [unit1, unit2])

		expect(unit).to.deep.equal({
			numerators: ['b', 'a', 'z', 'z'],
			denominators: ['e', 'f']
		})
	})
})
