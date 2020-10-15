import { any, equals, is, map, pluck } from 'ramda'
import React from 'react'
import { Mecanism } from '../components/mecanisms/common'
import { evaluateNode, makeJsx, mergeAllMissing } from '../evaluation'

const evaluate = (cache, situation, parsedRules, node) => {
	const [nodeValue, explanation] = node.explanation.reduce(
		([nodeValue, explanation], node) => {
			if (nodeValue === false) {
				return [nodeValue, [...explanation, node]]
			}
			const evaluatedNode = evaluateNode(cache, situation, parsedRules, node)
			return [
				nodeValue === false || nodeValue === null
					? nodeValue
					: evaluatedNode.nodeValue,
				[...explanation, evaluatedNode]
			]
		},
		[true, []]
	)

	return {
		...node,
		nodeValue,
		explanation,
		missingVariables: mergeAllMissing(explanation)
	}
}

export const mecanismAllOf = (recurse, v) => {
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
