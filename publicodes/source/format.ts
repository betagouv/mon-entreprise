import { memoizeWith } from 'ramda'
import { Evaluation, Unit } from './AST/types'
import { serializeUnit } from './units'
import { capitalise0 } from './utils'

const NumberFormat = memoizeWith(
	(...args) => JSON.stringify(args),
	Intl.NumberFormat
)

export const numberFormatter = ({
	style,
	maximumFractionDigits = 2,
	minimumFractionDigits = 0,
	language,
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
		minimumFractionDigits: adaptedMinimumFractionDigits,
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
	value,
}: formatValueOptions) {
	if (typeof value !== 'number') {
		return value
	}
	const serializedUnit = unit ? serializeUnit(unit, value, language) : undefined
	switch (serializedUnit) {
		case '€':
			return numberFormatter({
				style: 'currency',
				maximumFractionDigits,
				minimumFractionDigits,
				language,
			})(value)
		case '%':
			return numberFormatter({
				style: 'percent',
				maximumFractionDigits,
				language,
			})(value / 100)
		default:
			return (
				numberFormatter({
					style: 'decimal',
					minimumFractionDigits,
					maximumFractionDigits,
					language,
				})(value) +
				(typeof serializedUnit === 'string' ? `\u00A0${serializedUnit}` : '')
			)
	}
}

const booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' },
}

type Options = {
	language?: string
	displayedUnit?: string
	precision?: number
}

type Commune = {
	nom: string
	codePostal?: string
	departement: { nom: string }
}

export function formatValue(
	value: number | { nodeValue: Evaluation; unit?: Unit } | undefined,

	{ language = 'fr', displayedUnit, precision = 2 }: Options = {}
) {
	const nodeValue =
		typeof value === 'number' || typeof value === 'undefined'
			? value
			: value.nodeValue

	const unit =
		displayedUnit ??
		(typeof value === 'number' ||
		typeof value === 'undefined' ||
		!('unit' in value)
			? undefined
			: value.unit)

	if (
		(typeof nodeValue === 'number' && Number.isNaN(nodeValue)) ||
		nodeValue == null
	) {
		return '-'
	}
	return typeof nodeValue === 'string'
		? capitalise0(nodeValue.replace('\\n', '\n'))
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
				value: nodeValue,
		  })
		: null
}

export function serializeValue(
	{ nodeValue, unit }: { nodeValue: Evaluation; unit?: Unit },
	{ language = 'fr' }
) {
	const serializedUnit = (unit && typeof nodeValue === 'number'
		? serializeUnit(unit, nodeValue, language)
		: ''
	)?.replace(/\s*\/\s*/g, '/')
	return `${nodeValue} ${serializedUnit}`.trim()
}
