import { serialiseUnit } from 'Engine/units'
import { memoizeWith } from 'ramda'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

export let numberFormatter = ({
	style,
	maximumFractionDigits = 2,
	minimumFractionDigits = 0,
	language
}) => value =>
	NumberFormat(language, {
		style,
		currency: 'EUR',
		maximumFractionDigits,
		minimumFractionDigits
	}).format(value)

export const currencyFormat = language => ({
	isCurrencyPrefixed: !!numberFormatter({ language, style: 'currency' })(
		12
	).match(/^€/),
	thousandSeparator: formatCurrency(1000, language).charAt(1),
	decimalSeparator: formatCurrency(0.1, language).charAt(1)
})

export const formatCurrency = (value, language) => {
	return value == null
		? ''
		: formatValue({ unit: '€', language, value }).replace(/^(-)?€/, '$1€\u00A0')
}

export const formatPercentage = value =>
	value == null
		? ''
		: formatValue({ unit: '%', value, maximumFractionDigits: 2 })

export function formatValue({
	maximumFractionDigits,
	minimumFractionDigits,
	language,
	unit,
	value
}) {
	if (typeof value !== 'number') {
		return value
	}
	const serializedUnit = typeof unit == 'object' ? serialiseUnit(unit) : unit

	switch (serializedUnit) {
		case '€':
			return numberFormatter({
				style: 'currency',
				maximumFractionDigits,
				minimumFractionDigits,
				language
			})(value)
		case '%':
			return numberFormatter({ style: 'percent', maximumFractionDigits })(value)
		default:
			return (
				numberFormatter({
					style: 'decimal',
					minimumFractionDigits,
					maximumFractionDigits
				})(value) +
				(typeof serializedUnit === 'string' ? `\u00A0${serializedUnit}` : '')
			)
	}
}
