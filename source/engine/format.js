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

export const formatCurrency = (value, language) => {
	return value == null
		? ''
		: numberFormatter({ language })(value).replace(/^(-)?€/, '$1€\u00A0')
}

export const currencyFormat = language => ({
	isCurrencyPrefixed: !!numberFormatter({ language, style: 'currency' })(
		12
	).match(/^€/),
	thousandSeparator: formatCurrency(1000, language).charAt(1),
	decimalSeparator: formatCurrency(0.1, language).charAt(1)
})

const sanitizeValue = language => value =>
	language === 'fr' ? String(value).replace(',', '.') : value

export const formatPercentage = value => +(value * 100).toFixed(2)
export const normalizePercentage = value => value / 100

export const getFormatersFromUnit = (unit, language = 'en') => {
	const serializedUnit = typeof unit == 'object' ? serialiseUnit(unit) : unit
	const sanitize = sanitizeValue(language)
	switch (serializedUnit) {
		case '%':
			return {
				format: v =>
					numberFormatter({ style: 'percent', language })(v)
						.replace('%', '')
						.trim(),
				normalize: v => normalizePercentage(sanitize(v))
			}
		default:
			return {
				format: x =>
					Number(x)
						? numberFormatter({ style: 'decimal', language })(Number(x))
						: x,
				normalize: x => sanitize(x)
			}
	}
}

export function formatValue({
	maximumFractionDigits,
	minimumFractionDigits,
	language,
	unit,
	value
}) {
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
			if (typeof value !== 'number') {
				return value
			}
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
