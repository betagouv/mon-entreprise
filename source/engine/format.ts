import { serialiseUnit } from 'Engine/units'
import { memoizeWith } from 'ramda'
import { Unit } from './units'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

export let numberFormatter = ({
	style,
	maximumFractionDigits = 2,
	minimumFractionDigits = 0,
	language
}: {
	style?: string
	maximumFractionDigits?: number
	minimumFractionDigits?: number
	language?: string
}) => (value: number) => {
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

export const currencyFormat = (language: string | undefined) => ({
	isCurrencyPrefixed: !!numberFormatter({ language, style: 'currency' })(
		12
	).match(/^€/),
	thousandSeparator: numberFormatter({ language })(1000).charAt(1),
	decimalSeparator: numberFormatter({ language })(0.1).charAt(1)
})

export const formatCurrency = (value: number | undefined, language: string) => {
	return value == null
		? ''
		: formatValue({ unit: '€', language, value }).replace(/^(-)?€/, '$1€\u00A0')
}

export const formatPercentage = (value: number | undefined) =>
	value == null
		? ''
		: formatValue({ unit: '%', value, maximumFractionDigits: 2 })

export type formatValueOptions = {
	maximumFractionDigits?: number
	minimumFractionDigits?: number
	language?: string
	unit?: Unit | string
	value: number
}

export function formatValue({
	maximumFractionDigits,
	minimumFractionDigits,
	language,
	unit,
	value
}: formatValueOptions) {
	if (typeof value !== 'number') {
		return value
	}
	let serializedUnit = unit ? serialiseUnit(unit, value, language) : undefined
	if (serializedUnit === '') {
		serializedUnit = '%'
		value *= 100
	}
	switch (serializedUnit) {
		case '€':
			return numberFormatter({
				style: 'currency',
				maximumFractionDigits,
				minimumFractionDigits,
				language
			})(value)
		case '%':
			return numberFormatter({
				style: 'percent',
				maximumFractionDigits,
				language
			})(value / 100)
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
