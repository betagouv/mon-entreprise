import { expect } from 'chai'
import {
	areUnitConvertible,
	convertUnit,
	inferUnit,
	parseUnit,
	removeOnce,
} from '../source/units'

describe('Units', () => {
	it('should remove the first element encounter in the list', () => {
		let result = removeOnce(4)([1, 4, 6, 5, 4])
		expect(result).to.deep.equal([1, 6, 5, 4])
	})
	it('should parse string units into object', () => {
		expect(parseUnit('m')).to.deep.equal({
			numerators: ['m'],
			denominators: [],
		})
		expect(parseUnit('/an')).to.deep.equal({
			numerators: [],
			denominators: ['an'],
		})
		expect(parseUnit('m/s')).to.deep.equal({
			numerators: ['m'],
			denominators: ['s'],
		})
		expect(parseUnit('kg.m/s')).to.deep.equal({
			numerators: ['kg', 'm'],
			denominators: ['s'],
		})
		expect(parseUnit('kg.m/s')).to.deep.equal({
			numerators: ['kg', 'm'],
			denominators: ['s'],
		})
		expect(parseUnit('€/personne/mois')).to.deep.equal({
			numerators: ['€'],
			denominators: ['personne', 'mois'],
		})
	})
	it('should work with simple use case *', () => {
		let unit1 = { numerators: ['m'], denominators: ['s'] }
		let unit2 = { numerators: ['s'], denominators: [] }
		let unit = inferUnit('*', [unit1, unit2])

		expect(unit).to.deep.equal({
			numerators: ['m'],
			denominators: [],
		})
	})
	it('should work with simple use case / ', () => {
		let unit1 = { numerators: ['m'], denominators: ['s'] }
		let unit2 = { numerators: ['m'], denominators: [] }
		let unit = inferUnit('/', [unit1, unit2])

		expect(unit).to.deep.equal({
			numerators: [],
			denominators: ['s'],
		})
	})
	it('should work with advanced use case /', () => {
		let unit1 = { numerators: ['a', 'b', 'a', 'z'], denominators: ['c'] }
		let unit2 = { numerators: ['a', 'e', 'f'], denominators: ['z', 'c'] }
		let unit = inferUnit('/', [unit1, unit2])

		expect(unit).to.deep.equal({
			numerators: ['b', 'a', 'z', 'z'],
			denominators: ['e', 'f'],
		})
	})
})

describe('convertUnit', () => {
	it('should convert month to year in denominator', () => {
		expect(convertUnit(parseUnit('/mois'), parseUnit('/an'), 10)).to.eq(120)
	})
	it('should convert year to month in denominator', () => {
		expect(convertUnit(parseUnit('/an'), parseUnit('/mois'), 120)).to.eq(10)
	})
	it('should convert year to month in numerator', () => {
		expect(convertUnit(parseUnit('mois'), parseUnit('an'), 12)).to.eq(1)
	})
	it('should month to year in numerator', () => {
		expect(convertUnit(parseUnit('mois'), parseUnit('an'), 12)).to.eq(1)
	})
	it('should convert percentage to simple value', () => {
		expect(convertUnit(parseUnit('%'), parseUnit(''), 83)).to.closeTo(
			0.83,
			0.0000001
		)
	})
	it('should convert more difficult value', () => {
		expect(convertUnit(parseUnit('%/an'), parseUnit('/mois'), 12)).to.closeTo(
			0.01,
			0.0000001
		)
	})
	it('should convert year, month, day, k€', () => {
		expect(
			convertUnit(
				parseUnit('€/personne/jour'),
				parseUnit('k€/an/personne'),
				'100'
			)
		).to.closeTo(36.5, 0.0000001)
	})
	it('should handle simplification', () => {
		expect(
			convertUnit(parseUnit('€.an.%/mois'), parseUnit('€'), 100)
		).to.closeTo(12, 0.0000001)
	})
	it('should handle complexification', () => {
		expect(
			convertUnit(parseUnit('€'), parseUnit('€.an.%/mois'), 12)
		).to.closeTo(100, 0.0000001)
	})
})

describe('areUnitConvertible', () => {
	it('should be true for temporel unit', () => {
		expect(areUnitConvertible(parseUnit('mois'), parseUnit('an'))).to.eq(true)
		expect(areUnitConvertible(parseUnit('jours'), parseUnit('ans'))).to.eq(true)
		expect(areUnitConvertible(parseUnit('kg/an'), parseUnit('kg/mois'))).to.eq(
			true
		)
	})
	it('should be true for percentage', () => {
		expect(areUnitConvertible(parseUnit('%/mois'), parseUnit('/an'))).to.eq(
			true
		)
	})
	it('should be true for more complicated cases', () => {
		expect(
			areUnitConvertible(
				parseUnit('€/personne/mois'),
				parseUnit('€/an/personne')
			)
		).to.eq(true)
	})
	it('should be false for unit not alike', () => {
		expect(
			areUnitConvertible(parseUnit('mois'), parseUnit('€/an/personne'))
		).to.eq(false)
		expect(areUnitConvertible(parseUnit('m.m'), parseUnit('m'))).to.eq(false)
		expect(areUnitConvertible(parseUnit('m'), parseUnit('s'))).to.eq(false)
	})
})
