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
}) => value => {
	// When we format currency we don't want to display a single decimal digit
	// ie 8,1€ but we want to display 8,10€
	const adaptedMinimumFractionDigits =
		style === 'currency' &&
		maximumFractionDigits >= 2 &&
		minimumFractionDigits === 0 &&
		!Number.isInteger(value)
			? 2
			: minimumFractionDigits
	return NumberFormat(language, {
		style,
		currency: 'EUR',
		maximumFractionDigits,
		minimumFractionDigits: adaptedMinimumFractionDigits
	}).format(value)
}

export const currencyFormat = language => ({
	isCurrencyPrefixed: !!numberFormatter({ language, style: 'currency' })(
		12
	).match(/^€/),
	thousandSeparator: numberFormatter({ language })(1000).charAt(1),
	decimalSeparator: numberFormatter({ language })(0.1).charAt(1)
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
	const serializedUnit = serialiseUnit(unit, value, language)

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
					maximumFractionDigits,
					language
				})(value) +
				(typeof serializedUnit === 'string' ? `\u00A0${serializedUnit}` : '')
			)
	}
}
