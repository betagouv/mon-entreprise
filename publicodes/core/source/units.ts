import {
	countBy,
	equals,
	flatten,
	isEmpty,
	keys,
	map,
	pipe,
	remove,
	uniq,
	unnest,
	without,
} from 'ramda'
import i18n from './i18n'
import { Evaluation, Unit } from './AST/types'

export const parseUnit = (string: string, lng = 'fr'): Unit => {
	const [a, ...b] = string.split('/').map((u) => u.trim()),
		result = {
			numerators: a
				.split('.')
				.filter(Boolean)
				.map((unit) => getUnitKey(unit, lng)),
			denominators: b.map((unit) => getUnitKey(unit, lng)),
		}
	return result
}

const translations = (lng: string) =>
	Object.entries(i18n.getResourceBundle(lng, 'units'))
function getUnitKey(unit: string, lng: string): string {
	const key = translations(lng)
		.find(([, trans]) => trans === unit)?.[0]
		.replace(/_plural$/, '')
	return key || unit
}

const printUnits = (units: Array<string>, count: number, lng: string): string =>
	units
		.sort()
		.map((unit) => i18n.t(`units:${unit}`, { count, lng }))
		.join('.')

const plural = 2
export const serializeUnit = (
	rawUnit: Unit | undefined | string,
	count: number = plural,
	lng = 'fr'
) => {
	if (rawUnit === null || typeof rawUnit !== 'object') {
		return typeof rawUnit === 'string'
			? i18n.t(`units:${rawUnit}`, { count, lng })
			: rawUnit
	}
	const unit = simplify(rawUnit),
		{ numerators = [], denominators = [] } = unit

	const n = !isEmpty(numerators)
	const d = !isEmpty(denominators)
	const string =
		!n && !d
			? ''
			: n && !d
			? printUnits(numerators, count, lng)
			: !n && d
			? `/${printUnits(denominators, 1, lng)}`
			: `${printUnits(numerators, plural, lng)} / ${printUnits(
					denominators,
					1,
					lng
			  )}`

	return string
}

type SupportedOperators = '*' | '/' | '+' | '-'

const noUnit = { numerators: [], denominators: [] }
export const inferUnit = (
	operator: SupportedOperators,
	rawUnits: Array<Unit | undefined>
): Unit | undefined => {
	if (operator === '/') {
		if (rawUnits.length !== 2)
			throw new Error('Infer units of a division with units.length !== 2)')
		return inferUnit('*', [
			rawUnits[0] || noUnit,
			{
				numerators: (rawUnits[1] || noUnit).denominators,
				denominators: (rawUnits[1] || noUnit).numerators,
			},
		])
	}
	const units = rawUnits.filter(Boolean)
	if (units.length <= 1) {
		return units[0]
	}
	if (operator === '*')
		return simplify({
			numerators: unnest(units.map((u) => u?.numerators ?? [])),
			denominators: unnest(units.map((u) => u?.denominators ?? [])),
		})

	if (operator === '-' || operator === '+') {
		return rawUnits.find((u) => u)
	}

	return undefined
}

export const removeOnce = <T>(
	element: T,
	eqFn: (a: T, b: T) => boolean = equals
) => (list: Array<T>): Array<T> => {
	const index = list.findIndex((e) => eqFn(e, element))
	if (index > -1) return remove<T>(index, 1)(list)
	else return list
}

const simplify = (
	unit: Unit,
	eqFn: (a: string, b: string) => boolean = equals
): Unit =>
	[...unit.numerators, ...unit.denominators].reduce(
		({ numerators, denominators }, next) =>
			numerators.find((u) => eqFn(next, u)) &&
			denominators.find((u) => eqFn(next, u))
				? {
						numerators: removeOnce(next, eqFn)(numerators),
						denominators: removeOnce(next, eqFn)(denominators),
				  }
				: { numerators, denominators },
		unit
	)

const convertTable: { readonly [index: string]: number } = {
	'mois/an': 12,
	'jour/an': 365,
	'jour/mois': 365 / 12,
	'trimestre/an': 4,
	'mois/trimestre': 3,
	'jour/trimestre': (365 / 12) * 3,
	'€/k€': 10 ** 3,
	'g/kg': 10 ** 3,
	'mg/g': 10 ** 3,
	'mg/kg': 10 ** 6,
}
function singleUnitConversionFactor(
	from: string,
	to: string
): number | undefined {
	return (
		convertTable[`${to}/${from}`] ||
		(convertTable[`${from}/${to}`] && 1 / convertTable[`${from}/${to}`])
	)
}
function unitsConversionFactor(from: string[], to: string[]): number {
	let factor =
		100 **
		// Factor is mutliplied or divided 100 for each '%' in units
		(to.filter((unit) => unit === '%').length -
			from.filter((unit) => unit === '%').length)
	;[factor] = from.reduce(
		([value, toUnits], fromUnit) => {
			const index = toUnits.findIndex(
				(toUnit) => !!singleUnitConversionFactor(fromUnit, toUnit)
			)
			const factor = singleUnitConversionFactor(fromUnit, toUnits[index]) || 1
			return [
				value * factor,
				[...toUnits.slice(0, index + 1), ...toUnits.slice(index + 1)],
			]
		},
		[factor, to]
	)
	return factor
}

export function convertUnit(
	from: Unit | undefined,
	to: Unit | undefined,
	value: number
): number
export function convertUnit(
	from: Unit | undefined,
	to: Unit | undefined,
	value: Evaluation<number>
): Evaluation<number>
export function convertUnit(
	from: Unit | undefined,
	to: Unit | undefined,
	value: number | Evaluation<number>
) {
	if (!areUnitConvertible(from, to)) {
		throw new Error(
			`Impossible de convertir l'unité '${serializeUnit(
				from
			)}' en '${serializeUnit(to)}'`
		)
	}
	if (!value) {
		return value
	}
	if (from === undefined) {
		return value
	}
	const [fromSimplified, factorTo] = simplifyUnitWithValue(from || noUnit)
	const [toSimplified, factorFrom] = simplifyUnitWithValue(to || noUnit)
	return round(
		((value * factorTo) / factorFrom) *
			unitsConversionFactor(
				fromSimplified.numerators,
				toSimplified.numerators
			) *
			unitsConversionFactor(
				toSimplified.denominators,
				fromSimplified.denominators
			)
	)
}

const convertibleUnitClasses = [
	['mois', 'an', 'jour', 'trimestre'],
	['€', 'k€'],
	['g', 'kg', 'mg'],
]
function areSameClass(a: string, b: string) {
	return (
		a === b ||
		convertibleUnitClasses.some(
			(units) => units.includes(a) && units.includes(b)
		)
	)
}

function round(value: number) {
	return +value.toFixed(16)
}
export function simplifyUnit(unit: Unit): Unit {
	const { numerators, denominators } = simplify(unit, areSameClass)
	if (numerators.length && numerators.every((symb) => symb === '%')) {
		return { numerators: ['%'], denominators }
	}
	return {
		numerators: without(['%'], numerators),
		denominators: without(['%'], denominators),
	}
}
function simplifyUnitWithValue(unit: Unit, value = 1): [Unit, number] {
	const { denominators, numerators } = unit

	const factor = unitsConversionFactor(numerators, denominators)
	return [
		simplify(
			{
				numerators: without(['%'], numerators),
				denominators: without(['%'], denominators),
			},
			areSameClass
		),
		value ? round(value * factor) : value,
	]
}
export function areUnitConvertible(a: Unit | undefined, b: Unit | undefined) {
	if (a == null || b == null) {
		return true
	}
	const countByUnitClass = countBy((unit: string) => {
		const classIndex = convertibleUnitClasses.findIndex((unitClass) =>
			unitClass.includes(unit)
		)
		return classIndex === -1 ? unit : '' + classIndex
	})

	const [numA, denomA, numB, denomB] = [
		a.numerators,
		a.denominators,
		b.numerators,
		b.denominators,
	].map(countByUnitClass)
	const unitClasses = pipe(
		map(keys),
		flatten,
		uniq
	)([numA, denomA, numB, denomB])
	return unitClasses.every(
		(unitClass) =>
			(numA[unitClass] || 0) - (denomA[unitClass] || 0) ===
				(numB[unitClass] || 0) - (denomB[unitClass] || 0) || unitClass === '%'
	)
}
