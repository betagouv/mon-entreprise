import { is, map } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Mecanism } from '../components/mecanisms/common'
import {
	makeJsx,
	mergeAllMissing,
	registerEvaluationFunction
} from '../evaluation'

const evaluate: evaluationFunction = function(node) {
	const [nodeValue, explanation] = node.explanation.reduce(
		([nodeValue, explanation], node) => {
			if (nodeValue === false) {
				return [nodeValue, [...explanation, node]]
			}
			const evaluatedNode = this.evaluateNode(node)
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
		jsx,
		explanation,
		category: 'mecanism',
		name: 'toutes ces conditions',
		nodeKind: 'toutes ces conditions',
		type: 'boolean'
	}
}

registerEvaluationFunction('toutes ces conditions', evaluate)
