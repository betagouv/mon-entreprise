import { expect } from 'chai'
import { parseUnit } from '../source/units'
import { formatValue } from '../source/format'

describe('format engine values', () => {
	it('format currencies', () => {
		expect(formatValue({ nodeValue: 12, unit: '€', language: 'fr' })).to.equal(
			'12 €'
		)
		expect(
			formatValue({ nodeValue: 1200, unit: '€', language: 'fr' })
		).to.equal('1 200 €')
		expect(formatValue({ nodeValue: 12, unit: '€', language: 'en' })).to.equal(
			'€12'
		)
		expect(
			formatValue({ nodeValue: 12.1, unit: '€', language: 'en' })
		).to.equal('€12.10')
		expect(
			formatValue({ nodeValue: 12.123, unit: '€', language: 'en' })
		).to.equal('€12.12')
	})

	it('format percentages', () => {
		expect(formatValue({ nodeValue: 10, unit: '%' })).to.equal('10%')
		expect(formatValue({ nodeValue: 100, unit: '%' })).to.equal('100%')
		expect(formatValue({ nodeValue: 10.2, unit: '%' })).to.equal('10.2%')
	})

	it('format values', () => {
		expect(formatValue({ unit: '€', nodeValue: 12 })).to.equal('€12')
		expect(formatValue({ unit: '€', nodeValue: 12.1 })).to.equal('€12.10')
		expect(formatValue({ unit: '€', nodeValue: 12, language: 'fr' })).to.equal(
			'12 €'
		)
		expect(formatValue({ nodeValue: 1200, language: 'fr' })).to.equal('1 200')
	})
})

describe('Units handling', () => {
	it('translate unit', () => {
		expect(
			formatValue({ nodeValue: 1, unit: 'jour', language: 'fr' })
		).to.equal('1 jour')
		expect(
			formatValue({ nodeValue: 1, unit: 'jour', language: 'en' })
		).to.equal('1 day')
	})

	it('pluralize unit', () => {
		expect(
			formatValue({ nodeValue: 2, unit: 'jour', language: 'fr' })
		).to.equal('2 jours')
		expect(
			formatValue({
				nodeValue: 7,
				unit: parseUnit('jour/semaine'),
				language: 'fr'
			})
		).to.equal('7 jours / semaine')
	})
})
