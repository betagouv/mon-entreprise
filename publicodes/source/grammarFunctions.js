/* Those are postprocessor functions for the Nearley grammar.ne.
The advantage of putting them here is to get prettier's JS formatting, since Nealrey doesn't support it https://github.com/kach/nearley/issues/310 */
import { normalizeDateString } from './date'
import { parseUnit } from './units'
import { parsePeriod } from './temporal'

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

export let temporalNumericValue = (variable, word, date) => ({
	temporalValue: {
		explanation: variable,
		period: parsePeriod(word.value.slice(2), date)
	}
})

export let variable = ([firstFragment, nextFragment], _, reject) => {
	const fragments = [firstFragment, ...nextFragment].map(({ value }) => value)
	if (!nextFragment.length && ['oui', 'non'].includes(firstFragment)) {
		return reject
	}
	return {
		variable: fragments.join(' . ')
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
	return {
		constant: {
			type: 'date',
			nodeValue: normalizeDateString(value)
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
