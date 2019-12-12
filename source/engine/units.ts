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
	without
} from 'ramda'
import i18n from '../i18n'

type BaseUnit = string

export type Unit = {
	numerators: Array<BaseUnit>
	denominators: Array<BaseUnit>
}

//TODO this function does not handle complex units like passenger-kilometer/flight
export let parseUnit = (string: string): Unit => {
	let [a, ...b] = string.split('/'),
		result = {
			numerators: a
				.split('.')
				.filter(Boolean)
				.map(getUnitKey),
			denominators: b.map(getUnitKey)
		}
	return result
}

const translations = Object.entries(
	i18n.getResourceBundle(i18n.language, 'units')
)
function getUnitKey(unit: string): string {
	const key = translations
		.find(([, trans]) => trans === unit)?.[0]
		.replace(/_plural$/, '')
	return key || unit
}

let printUnits = (units: Array<string>, count: number): string =>
	units
		.filter(unit => unit !== '%')
		.map(unit => i18n.t(`units:${unit}`, { count }))
		.join('.')

const plural = 2
export let serialiseUnit = (
	rawUnit: Unit | null | string,
	count: number = plural,
	lng?: string
) => {
	if (rawUnit === null || typeof rawUnit !== 'object') {
		return typeof rawUnit === 'string'
			? i18n.t(`units:${rawUnit}`, { count, lng })
			: rawUnit
	}
	let unit = simplify(rawUnit),
		{ numerators = [], denominators = [] } = unit
	// the unit '%' is only displayed when it is the only unit
	let merge = [...numerators, ...denominators]
	if (merge.length === 1 && merge[0] === '%') return '%'

	let n = !isEmpty(numerators)
	let d = !isEmpty(denominators)
	let string =
		!n && !d
			? ''
			: n && !d
			? printUnits(numerators, count)
			: !n && d
			? `/${printUnits(denominators, 1)}`
			: `${printUnits(numerators, plural)} / ${printUnits(denominators, 1)}`

	return string
}

type SupportedOperators = '*' | '/' | '+' | '-'

let noUnit = { numerators: [], denominators: [] }
export let inferUnit = (
	operator: SupportedOperators,
	rawUnits: Array<Unit>
): Unit => {
	let units = rawUnits.map(u => u || noUnit)
	if (operator === '*')
		return simplify({
			numerators: unnest(units.map(u => u.numerators)),
			denominators: unnest(units.map(u => u.denominators))
		})
	if (operator === '/') {
		if (units.length !== 2)
			throw new Error('Infer units of a division with units.length !== 2)')
		return inferUnit('*', [
			units[0],
			{
				numerators: units[1].denominators,
				denominators: units[1].numerators
			}
		])
	}

	if (operator === '-' || operator === '+') {
		return rawUnits.find(u => u)
	}

	return null
}

export let removeOnce = <T>(
	element: T,
	eqFn: (a: T, b: T) => boolean = equals
) => (list: Array<T>): Array<T> => {
	let index = list.findIndex(e => eqFn(e, element))
	if (index > -1) return remove<T>(index, 1)(list)
	else return list
}

let simplify = (
	unit: Unit,
	eqFn: (a: string, b: string) => boolean = equals
): Unit =>
	[...unit.numerators, ...unit.denominators].reduce(
		({ numerators, denominators }, next) =>
			numerators.find(u => eqFn(next, u)) &&
			denominators.find(u => eqFn(next, u))
				? {
						numerators: removeOnce(next, eqFn)(numerators),
						denominators: removeOnce(next, eqFn)(denominators)
				  }
				: { numerators, denominators },
		unit
	)

const convertTable: { readonly [index: string]: number } = {
	'mois/an': 12,
	'€/k€': 1000,
	'jour/an': 365,
	'jour/mois': 365 / 12,
	'trimestre/an': 4,
	'mois/trimestre': 3,
	'jour/trimestre': (365 / 12) * 3
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
	let factor = 1
	if (to.includes('%')) {
		factor *= 100
	}
	if (from.includes('%')) {
		factor /= 100
	}
	;[factor] = from.reduce(
		([value, toUnits], fromUnit) => {
			const index = toUnits.findIndex(
				toUnit => !!singleUnitConversionFactor(fromUnit, toUnit)
			)
			const factor = singleUnitConversionFactor(fromUnit, toUnits[index]) || 1
			return [
				value * factor,
				[...toUnits.slice(0, index + 1), ...toUnits.slice(index + 1)]
			]
		},
		[factor, to]
	)
	return factor
}

export function convertUnit(from: Unit, to: Unit, value: number) {
	if (!areUnitConvertible(from, to)) {
		throw new Error(
			`Impossible de convertir l'unité '${serialiseUnit(
				from
			)}' en '${serialiseUnit(to)}'`
		)
	}
	if (!value) {
		return value
	}
	const [fromSimplified, factorTo] = simplifyUnitWithValue(from)
	const [toSimplified, factorFrom] = simplifyUnitWithValue(to)
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
	['€', 'k€']
]
function areSameClass(a: string, b: string) {
	return (
		a === b ||
		convertibleUnitClasses.some(units => units.includes(a) && units.includes(b))
	)
}

function round(value: number) {
	return +value.toFixed(16)
}
export function simplifyUnitWithValue(
	unit: Unit,
	value: number = 1
): [Unit, number] {
	const { denominators, numerators } = unit
	const factor = unitsConversionFactor(numerators, denominators)
	return [
		simplify(
			{
				numerators: without(['%'], numerators),
				denominators: without(['%'], denominators)
			},
			areSameClass
		),
		value ? round(value * factor) : value
	]
}
export function areUnitConvertible(a: Unit, b: Unit) {
	if (a == null || b == null) {
		return true
	}
	const countByUnitClass = countBy((unit: string) => {
		const classIndex = convertibleUnitClasses.findIndex(unitClass =>
			unitClass.includes(unit)
		)
		return classIndex === -1 ? unit : '' + classIndex
	})
	const [numA, denomA, numB, denomB] = [
		a.numerators,
		a.denominators,
		b.numerators,
		b.denominators
	].map(countByUnitClass)

	const unitClasses = pipe(
		map(keys),
		flatten,
		uniq
	)([numA, denomA, numB, denomB])

	return unitClasses.every(
		unitClass =>
			(numA[unitClass] || 0) - (denomA[unitClass] || 0) ===
				(numB[unitClass] || 0) - (denomB[unitClass] || 0) || unitClass === '%'
	)
}
export function isPercentUnit(unit: Unit) {
	if (!unit) {
		return false
	}
	const simplifiedUnit = simplifyUnitWithValue(unit)[0]
	return (
		simplifiedUnit.denominators.length === 0 &&
		simplifiedUnit.numerators.length === 0
	)
}
