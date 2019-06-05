import { remove, isEmpty } from 'ramda'

export let parseUnit = string => {
	let [a, b = ''] = string.split('/')
	return {
		numerators: a !== '' ? [a] : [],
		denominators: b !== '' ? [b] : []
	}
}

export let serializeUnit = ({ numerators, denominators }) => {
	let n = !isEmpty(numerators)
	let d = !isEmpty(denominators)
	return n && !d
		? numerators
		: !n && d
		? `/${denominators}`
		: `${numerators} / ${denominators}`
}

let noUnit = { numerators: [], denominators: [] }
export let inferUnit = (operator, unit1 = noUnit, unit2 = noUnit) =>
	operator === '*'
		? simplify({
				numerators: [...unit1.numerators, ...unit2.numerators],
				denominators: [...unit1.denominators, ...unit2.denominators]
		  })
		: operator === '/'
		? inferUnit('*', unit1, {
				numerators: unit2.denominators,
				denominators: unit2.numerators
		  })
		: null

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
