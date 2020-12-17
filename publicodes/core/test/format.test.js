import { expect } from 'chai'
import { parseUnit } from '../source/units'
import { formatValue, capitalise0 } from '../source/format'

describe('format engine values', () => {
	it('format currencies', () => {
		expect(formatValue(12, { displayedUnit: '€' })).to.equal('12 €')
		expect(formatValue(1200, { displayedUnit: '€' })).to.equal('1 200 €')
		expect(formatValue(12, { displayedUnit: '€', language: 'en' })).to.equal(
			'€12'
		)
		expect(formatValue(12.1, { displayedUnit: '€', language: 'en' })).to.equal(
			'€12.10'
		)
		expect(
			formatValue(12.123, { displayedUnit: '€', language: 'en' })
		).to.equal('€12.12')
	})

	it('format percentages', () => {
		expect(formatValue(10, { displayedUnit: '%' })).to.equal('10 %')
		expect(formatValue(100, { displayedUnit: '%' })).to.equal('100 %')
		expect(formatValue(10.2, { displayedUnit: '%' })).to.equal('10,2 %')
	})

	it('format values', () => {
		expect(formatValue(1200)).to.equal('1 200')
	})
})

describe('Units handling', () => {
	it('format displayedUnit', () => {
		const formatUnit = (unit, count) => unit + (count > 1 ? 's' : '')
		expect(formatValue(1, { displayedUnit: 'jour', formatUnit })).to.equal(
			'1 jour'
		)
		expect(formatValue(2, { displayedUnit: 'jour', formatUnit })).to.equal(
			'2 jours'
		)
		expect(
			formatValue(
				{
					nodeValue: 7,
					unit: parseUnit('jour/semaine'),
				},
				{ formatUnit }
			)
		).to.equal('7 jours / semaine')
	})
})

describe('capitalise0', function () {
	it('should turn the first character into its capital', function () {
		expect(capitalise0('salaire')).to.equal('Salaire')
	})
})
