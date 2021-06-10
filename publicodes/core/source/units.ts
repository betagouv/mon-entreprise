import { Evaluation, Unit } from './AST/types'

export type getUnitKey = (writtenUnit: string) => string
export type formatUnit = (unit: string, count: number) => string

export const parseUnit = (
	string: string,
	getUnitKey: getUnitKey = (x) => x
): Unit => {
	const [a, ...b] = string.split('/').map((u) => u.trim()),
		result = {
			numerators: a
				.split('.')
				.filter(Boolean)
				.map((unit) => getUnitKey(unit)),
			denominators: b.map((unit) => getUnitKey(unit)),
		}
	return result
}

const printUnits = (
	units: Array<string>,
	count: number,
	formatUnit: formatUnit = (x) => x
): string =>
	units
		.sort()
		.map((unit) => formatUnit(unit, count))
		.join('.')

const plural = 2
export const serializeUnit = (
	rawUnit: Unit | undefined | string,
	count: number = plural,
	formatUnit: formatUnit = (x) => x
): string | undefined => {
	if (rawUnit === null || typeof rawUnit !== 'object') {
		return typeof rawUnit === 'string' ? formatUnit(rawUnit, count) : rawUnit
	}
	const unit = simplify(rawUnit),
		{ numerators = [], denominators = [] } = unit

	const n = numerators.length > 0
	const d = denominators.length > 0
	const string =
		!n && !d
			? ''
			: n && !d
			? printUnits(numerators, count, formatUnit)
			: !n && d
			? `/${printUnits(denominators, 1, formatUnit)}`
			: `${printUnits(numerators, plural, formatUnit)} / ${printUnits(
					denominators,
					1,
					formatUnit
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
			numerators: units.flatMap((u) => u?.numerators ?? []),
			denominators: units.flatMap((u) => u?.denominators ?? []),
		})

	if (operator === '-' || operator === '+') {
		return rawUnits.find((u) => u)
	}

	return undefined
}

const equals = <T>(a: T, b: T) => {
	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.every((_, i) => a[i] === b[i])
	} else {
		return a === b
	}
}

export const removeOnce = <T>(
	element: T,
	eqFn: (a: T, b: T) => boolean = equals
) => (list: Array<T>): Array<T> => {
	const index = list.findIndex((e) => eqFn(e, element))
	return list.filter((_, i) => i !== index)
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

const convertTable: ConvertTable = {
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

const convertibleUnitClasses = unitClasses(convertTable)
type unitClasses = Array<Set<string>>
type ConvertTable = { readonly [index: string]: number }

// Reduce the convertTable provided by the user into a list of compatibles
// classes.
function unitClasses(convertTable: ConvertTable) {
	return Object.keys(convertTable).reduce(
		(classes: unitClasses, ratio: string) => {
			const [a, b] = ratio.split('/')
			const ia = classes.findIndex((units) => units.has(a))
			const ib = classes.findIndex((units) => units.has(b))
			if (ia > -1 && ib > -1 && ia !== ib) {
				throw Error(`Invalid ratio ${ratio}`)
			} else if (ia === -1 && ib === -1) {
				classes.push(new Set([a, b]))
			} else if (ia > -1) {
				classes[ia].add(b)
			} else if (ib > -1) {
				classes[ib].add(a)
			}
			return classes
		},
		[]
	)
}

function areSameClass(a: string, b: string) {
	return (
		a === b ||
		convertibleUnitClasses.some(
			(unitsClass) => unitsClass.has(a) && unitsClass.has(b)
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
	return removePercentages({ numerators, denominators })
}
function simplifyUnitWithValue(unit: Unit, value = 1): [Unit, number] {
	const factor = unitsConversionFactor(unit.numerators, unit.denominators)
	return [
		simplify(removePercentages(unit), areSameClass),
		value ? round(value * factor) : value,
	]
}

const removePercentages = (unit: Unit): Unit => ({
	numerators: unit.numerators.filter((e) => e !== '%'),
	denominators: unit.denominators.filter((e) => e !== '%'),
})

export function areUnitConvertible(a: Unit | undefined, b: Unit | undefined) {
	if (a == null || b == null) {
		return true
	}

	const countByUnitClass = (units: Array<string>) =>
		units.reduce((counters, unit) => {
			const classIndex = convertibleUnitClasses.findIndex((unitClass) =>
				unitClass.has(unit)
			)
			const key = classIndex === -1 ? unit : '' + classIndex
			return { ...counters, [key]: 1 + (counters[key] ?? 0) }
		}, {})

	const [numA, denomA, numB, denomB] = [
		a.numerators,
		a.denominators,
		b.numerators,
		b.denominators,
	].map(countByUnitClass)
	const uniq = <T>(arr: Array<T>): Array<T> => [...new Set(arr)]
	const unitClasses = [numA, denomA, numB, denomB].map(Object.keys).flat()
	return uniq(unitClasses).every(
		(unitClass) =>
			(numA[unitClass] || 0) - (denomA[unitClass] || 0) ===
				(numB[unitClass] || 0) - (denomB[unitClass] || 0) || unitClass === '%'
	)
}
