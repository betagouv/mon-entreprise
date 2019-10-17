import { expect } from 'chai'
import { formatCurrency, formatPercentage, formatValue } from './format'
import { parseUnit } from 'Engine/units'

describe('format engine values', () => {
	it('format currencies', () => {
		expect(formatCurrency(12, 'fr')).to.equal('12 €')
		expect(formatCurrency(1200, 'fr')).to.equal('1 200 €')
		expect(formatCurrency(12, 'en')).to.equal('€ 12')
		expect(formatCurrency(12.1)).to.equal('€ 12.10')
		expect(formatCurrency(12.123)).to.equal('€ 12.12')
	})

	it('format percentages', () => {
		expect(formatPercentage(0.1)).to.equal('10%')
		expect(formatPercentage(1)).to.equal('100%')
		expect(formatPercentage(0.102)).to.equal('10.2%')
	})

	it('format values', () => {
		expect(formatValue({ unit: '€', value: 12 })).to.equal('€12')
		expect(formatValue({ unit: '€', value: 12.1 })).to.equal('€12.10')
		expect(formatValue({ unit: '€', value: 12, language: 'fr' })).to.equal(
			'12 €'
		)
		expect(formatValue({ value: 1200, language: 'fr' })).to.equal('1 200')
	})
})

describe('Units handling', () => {
	it('translate unit', () => {
		expect(formatValue({ value: 1, unit: 'jour', language: 'fr' })).to.equal(
			'1 jour'
		)
		expect(formatValue({ value: 1, unit: 'jour', language: 'en' })).to.equal(
			'1 day'
		)
	})

	it('pluralize unit', () => {
		expect(formatValue({ value: 2, unit: 'jour', language: 'fr' })).to.equal(
			'2 jours'
		)
		expect(
			formatValue({ value: 7, unit: parseUnit('jour/semaine'), language: 'fr' })
		).to.equal('7 jours / semaine')
	})
})
