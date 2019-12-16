/* Those are postprocessor functions for the Nearley grammar.ne.
The advantage of putting them here is to get prettier's JS formatting, since Nealrey doesn't support it https://github.com/kach/nearley/issues/310 */
import { parseUnit } from 'Engine/units'

export let binaryOperation = operationType => ([A, , operator, , B]) => ({
	[operator]: {
		operationType,
		explanation: [A, B]
	}
})

export let unaryOperation = operationType => ([operator, , A]) => ({
	[operator]: {
		operationType,
		explanation: [number([{ value: '0' }]), A]
	}
})

export let filteredVariable = ([{ variable }, , { value: filter }]) => ({
	filter: { filter, explanation: variable }
})

export let variableWithConversion = ([{ variable }, , unit]) => ({
	unitConversion: { explanation: variable, unit: parseUnit(unit.value) }
})

export let variable = ([firstFragment, nextFragment], _, reject) => {
	const fragments = [firstFragment, ...nextFragment].map(({ value }) => value)
	if (!nextFragment.length && ['oui', 'non'].includes(firstFragment)) {
		return reject
	}
	return {
		variable: {
			fragments
		}
	}
}

export let number = ([{ value }]) => ({
	constant: {
		nodeValue: parseFloat(value)
	}
})

export let numberWithUnit = ([number, , unit]) => ({
	constant: {
		nodeValue: parseFloat(number.value),
		unit: parseUnit(unit.value)
	}
})

export let date = ([{ value }]) => {
	let [jour, mois, année] = value.split('/')
	if (!année) {
		;[jour, mois, année] = ['01', jour, mois]
	}
	const date = new Date(année, +mois - 1, jour)
	if (!+date || date.getDate() !== +jour) {
		throw new SyntaxError(`La date ${value} n'est pas valide`)
	}
	return {
		constant: {
			type: 'date',
			nodeValue: `${jour}/${mois}/${année}`
		}
	}
}

export let boolean = nodeValue => () => ({
	constant: {
		type: 'boolean',
		nodeValue
	}
})

export let string = ([{ value }]) => ({
	constant: {
		type: 'string',
		nodeValue: value.slice(1, -1)
	}
})
