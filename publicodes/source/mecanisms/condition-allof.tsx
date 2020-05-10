import { any, equals, is, map, pluck } from 'ramda'
import React from 'react'
import { Mecanism } from '../components/mecanisms/common'
import { evaluateNode, makeJsx, mergeAllMissing } from '../evaluation'

const evaluate = (cache, situation, parsedRules, node) => {
	const evaluateOne = child =>
		evaluateNode(cache, situation, parsedRules, child)
	const explanation = map(evaluateOne, node.explanation)
	const anyFalse = explanation.find(e => e.nodeValue === false) // court-circuit
	const { nodeValue, missingVariables } = anyFalse ?? {
		nodeValue: explanation.some(e => e.nodeValue === null) ? null : true,
		missingVariables: mergeAllMissing(explanation)
	}

	return { ...node, nodeValue, explanation, missingVariables }
}

export const mecanismAllOf = (recurse, k, v) => {
	if (!is(Array, v)) throw new Error('should be array')
	const explanation = map(recurse, v)
	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="toutes ces conditions" value={nodeValue} unit={unit}>
			<ul>
				{explanation.map((item, i) => (
					<li key={i}>{makeJsx(item)}</li>
				))}
			</ul>
		</Mecanism>
	)

	return {
		evaluate: evaluate,
		jsx,
		explanation,
		category: 'mecanism',
		name: 'toutes ces conditions',
		type: 'boolean'
	}
}
