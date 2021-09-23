import { Evaluation, Unit } from './AST/types'
import { simplifyNodeUnit } from './nodeUnits'
import { formatUnit, serializeUnit } from './units'

export const numberFormatter =
	({
		style,
		maximumFractionDigits = 2,
		minimumFractionDigits = 0,
		language,
	}: {
		style?: string
		maximumFractionDigits?: number
		minimumFractionDigits?: number
		language?: string
	}) =>
	(value: number) => {
		// When we format currency we don't want to display a single decimal digit
		// ie 8,1€ but we want to display 8,10€
		const adaptedMinimumFractionDigits =
			style === 'currency' &&
			maximumFractionDigits >= 2 &&
			minimumFractionDigits === 0 &&
			!Number.isInteger(value)
				? 2
				: minimumFractionDigits
		return Intl.NumberFormat(language, {
			style,
			currency: 'EUR',
			maximumFractionDigits,
			minimumFractionDigits: adaptedMinimumFractionDigits,
		}).format(value)
	}

export const formatCurrency = (
	nodeValue: number | undefined,
	language: string
) => {
	return nodeValue == null
		? ''
		: (formatNumber({ unit: '€', language, nodeValue }) ?? '').replace(
				/^(-)?€/,
				'$1€\u00A0'
		  )
}

export const formatPercentage = (nodeValue: number | undefined) =>
	nodeValue == null
		? ''
		: formatNumber({ unit: '%', nodeValue, maximumFractionDigits: 2 })

type formatValueOptions = {
	maximumFractionDigits?: number
	minimumFractionDigits?: number
	language?: string
	unit?: Unit | string
	formatUnit?: formatUnit
	nodeValue: number
}

function formatNumber({
	maximumFractionDigits,
	minimumFractionDigits,
	language,
	formatUnit,
	unit,
	nodeValue,
}: formatValueOptions) {
	if (typeof nodeValue !== 'number') {
		return nodeValue
	}
	const serializedUnit = unit
		? serializeUnit(unit, nodeValue, formatUnit)
		: undefined
	switch (serializedUnit) {
		case '€':
			return numberFormatter({
				style: 'currency',
				maximumFractionDigits,
				minimumFractionDigits,
				language,
			})(nodeValue)
		case '%':
			return numberFormatter({
				style: 'percent',
				maximumFractionDigits,
				language,
			})(nodeValue / 100)
		default:
			return (
				numberFormatter({
					style: 'decimal',
					minimumFractionDigits,
					maximumFractionDigits,
					language,
				})(nodeValue) +
				(typeof serializedUnit === 'string' ? `\u00A0${serializedUnit}` : '')
			)
	}
}

export function capitalise0(name: undefined): undefined
export function capitalise0(name: string): string
export function capitalise0(name?: string) {
	return name && name[0].toUpperCase() + name.slice(1)
}

const booleanTranslations = {
	fr: { true: 'Oui', false: 'Non' },
	en: { true: 'Yes', false: 'No' },
}

type Options = {
	language?: string
	displayedUnit?: string
	precision?: number
	formatUnit?: formatUnit
}

export function formatValue(
	value: number | { nodeValue: Evaluation; unit?: Unit } | undefined,

	{ language = 'fr', displayedUnit, formatUnit, precision = 2 }: Options = {}
) {
	let nodeValue =
		typeof value === 'number' || typeof value === 'undefined'
			? value
			: value.nodeValue

	if (
		(typeof nodeValue === 'number' && Number.isNaN(nodeValue)) ||
		nodeValue == null
	) {
		return '-'
	}
	if (typeof nodeValue === 'string') {
		return capitalise0(nodeValue.replace('\\n', '\n'))
	}
	if (typeof nodeValue === 'object') return (nodeValue as any).nom
	if (typeof nodeValue === 'boolean')
		return booleanTranslations[language][nodeValue]
	if (typeof nodeValue === 'number') {
		let unit =
			typeof value === 'number' ||
			typeof value === 'undefined' ||
			!('unit' in value)
				? undefined
				: value.unit
		if (unit) {
			const simplifiedNode = simplifyNodeUnit({
				unit,
				nodeValue,
			})
			unit = simplifiedNode.unit
			nodeValue = simplifiedNode.nodeValue as number
		}
		return formatNumber({
			minimumFractionDigits: 0,
			maximumFractionDigits: precision,
			language,
			formatUnit,
			nodeValue,
			unit: displayedUnit ?? unit,
		})
	}
	return null
}

export function serializeValue(
	{ nodeValue, unit }: { nodeValue: Evaluation; unit?: Unit },
	{ format }: { format: formatUnit }
) {
	const serializedUnit = (
		unit && typeof nodeValue === 'number'
			? serializeUnit(unit, nodeValue, format)
			: ''
	)?.replace(/\s*\/\s*/g, '/')
	return `${nodeValue} ${serializedUnit}`.trim()
}
