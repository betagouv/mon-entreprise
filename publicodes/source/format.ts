import { serializeUnit } from './units'
import { memoizeWith } from 'ramda'
import { Evaluation, Unit } from './types'
import { capitalise0 } from './utils'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

export const numberFormatter = ({
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

export const formatCurrency = (value: number | undefined, language: string) => {
	return value == null
		? ''
		: (formatNumber({ unit: '€', language, value }) ?? '').replace(
				/^(-)?€/,
				'$1€\u00A0'
		  )
}

export const formatPercentage = (value: number | undefined) =>
	value == null
		? ''
		: formatNumber({ unit: '%', value, maximumFractionDigits: 2 })

export type formatValueOptions = {
	maximumFractionDigits?: number
	minimumFractionDigits?: number
	language?: string
	unit?: Unit | string
	value: number
}

function formatNumber({
	maximumFractionDigits,
	minimumFractionDigits,
	language,
	unit,
	value
}: formatValueOptions) {
	if (typeof value !== 'number') {
		return value
	}
	let serializedUnit = unit ? serializeUnit(unit, value, language) : undefined
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

const booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' }
}

type ValueArg = {
	nodeValue: Evaluation
	language: string
	unit?: string | Unit
	precision?: number
}

export function formatValue({
	nodeValue,
	language,
	unit,
	precision = 2
}: ValueArg) {
	if (
		(typeof nodeValue === 'number' && Number.isNaN(nodeValue)) ||
		nodeValue === null
	) {
		return '-'
	}
	return typeof nodeValue === 'string'
		? capitalise0(nodeValue)
		: typeof nodeValue === 'object'
		? (nodeValue as any).nom
		: typeof nodeValue === 'boolean'
		? booleanTranslations[language][nodeValue]
		: typeof nodeValue === 'number'
		? formatNumber({
				minimumFractionDigits: 0,
				maximumFractionDigits: precision,
				language,
				unit,
				value: nodeValue
		  })
		: null
}
