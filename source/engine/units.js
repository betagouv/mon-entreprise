import { remove, isEmpty, unnest } from 'ramda'

//TODO this function does not handle complex units like passenger-kilometer/flight
export let parseUnit = string => {
	let [a, b = ''] = string.split('/'),
		result = {
			numerators: a !== '' ? [a] : [],
			denominators: b !== '' ? [b] : []
		}
	return result
}

let printUnits = units => units.filter(unit => unit !== '%').join('-')

export let serialiseUnit = rawUnit => {
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
			? printUnits(numerators)
			: !n && d
			? `/${printUnits(denominators)}`
			: `${printUnits(numerators)} / ${printUnits(denominators)}`

	return string
}

let noUnit = { numerators: [], denominators: [] }
export let inferUnit = (operator, rawUnits) => {
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
export let removeOnce = element => list => {
	let index = list.indexOf(element)
	if (index > -1) return remove(index, 1)(list)
	else return list
}

let simplify = unit =>
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
