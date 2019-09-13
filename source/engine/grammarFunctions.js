/* Those are postprocessor functions for the Nearley grammar.ne.
The advantage of putting them here is to get prettier's JS formatting, since Nealrey doesn't support it https://github.com/kach/nearley/issues/310 */
import { parseUnit } from 'Engine/units'

export let operation = operationType => ([A, , operator, , B]) => ({
	[operator]: {
		operationType,
		explanation: [A, B]
	}
})

export let filteredVariable = (
	[{ variable }, , { value: filter }],
	l,
	reject
) =>
	['mensuel', 'annuel'].includes(filter)
		? reject
		: { filter: { filter, explanation: variable } }

export let temporalVariable = ([{ variable }, , temporalTransform]) => ({
	temporalTransform: { explanation: variable, temporalTransform }
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

export let percentage = ([{ value }]) => ({
	constant: {
		type: 'percentage',
		unit: parseUnit('%'),
		nodeValue: parseFloat(value.slice(0, -1)) / 100
	}
})

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
