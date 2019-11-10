import { isEmpty, remove, unnest } from 'ramda'
import i18n from '../i18n'

type BaseUnit = string

export type Unit = {
	numerators: Array<BaseUnit>
	denominators: Array<BaseUnit>
}

//TODO this function does not handle complex units like passenger-kilometer/flight
export let parseUnit = (string: string): Unit => {
	let [a, b = ''] = string.split('/'),
		result = {
			numerators: a !== '' ? [getUnitKey(a)] : [],
			denominators: b !== '' ? [getUnitKey(b)] : []
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
		.join('-')

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

export let removeOnce = <T>(element: T) => (list: Array<T>): Array<T> => {
	let index = list.indexOf(element)
	if (index > -1) return remove<T>(index, 1)(list)
	else return list
}

let simplify = (unit: Unit): Unit =>
	[...unit.numerators, ...unit.denominators].reduce(
		({ numerators, denominators }, next) =>
			numerators.includes(next) && denominators.includes(next)
				? {
						numerators: removeOnce(next)(numerators),
						denominators: removeOnce(next)(denominators)
				  }
				: { numerators, denominators },
		unit
	)
