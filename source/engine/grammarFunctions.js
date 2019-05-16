/* Those are postprocessor functions for the Nearley grammar.ne. 
The advantage of putting them here is to get prettier's JS formatting, since Nealrey doesn't support it https://github.com/kach/nearley/issues/310 */

export let operation = type => ([A, , operator, , B]) => ({
	[operator]: {
		type: type,
		explanation: [A, B]
	}
})

export let filteredVariable = ([{ variable }, , filter], l, reject) =>
	['mensuel', 'annuel'].includes(filter)
		? reject
		: { filter: { filter, explanation: variable } }

export let temporalVariable = ([{ variable }, , temporalTransform]) => ({
	temporalTransform: { explanation: variable, temporalTransform }
})

export let variable = ([firstFragment, nextFragments], l, reject) => {
	let fragments = [firstFragment, ...nextFragments]
	if (fragments.length === 1 && ['oui', 'non'].includes(fragments[0]))
		return reject
	return {
		variable: {
			fragments
		}
	}
}

export let number = d => ({
	constant: {
		rawNode: d,
		nodeValue: parseFloat(
			d[0].join('') + (d[1] ? d[1][0] + d[1][1].join('') : '')
		)
	}
})

export let percentage = d => ({
	constant: {
		rawNode: d,
		type: 'percentage',
		nodeValue:
			parseFloat(d[0].join('') + (d[1] ? d[1][0] + d[1][1].join('') : '')) / 100
	}
})

export let boolean = ([val]) => ({
	constant: {
		rawNode: val,
		type: 'boolean',
		nodeValue: { oui: true, non: false }[val]
	}
})

export let string = d => ({
	constant: {
		type: 'string',
		nodeValue: d[1].join(''),
		rawNode: d[1].join('')
	}
})
