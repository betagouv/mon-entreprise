import { is, map, max, mergeWith, reduce } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Mecanism } from '../components/mecanisms/common'
import {
	collectNodeMissing,
	makeJsx,
	registerEvaluationFunction
} from '../evaluation'

const evaluate: evaluationFunction = function(node) {
	const explanation = node.explanation.map(child => this.evaluateNode(child))

	const anyTrue = explanation.find(e => e.nodeValue === true)
	const anyNull = explanation.find(e => e.nodeValue === null)
	const { nodeValue, missingVariables } = anyTrue ??
		anyNull ?? {
			nodeValue: false,
			// Unlike most other array merges of missing variables this is a "flat" merge
			// because "one of these conditions" tend to be several tests of the same variable
			// (e.g. contract type is one of x, y, z)
			missingVariables: reduce(
				mergeWith(max),
				{},
				map(collectNodeMissing, explanation)
			)
		}

	return { ...node, nodeValue, explanation, missingVariables }
}

export const mecanismOneOf = (recurse, v) => {
	if (!is(Array, v)) throw new Error('should be array')
	const explanation = map(recurse, v)
	const jsx = ({ nodeValue, explanation, unit }) => (
		<Mecanism name="une de ces conditions" value={nodeValue} unit={unit}>
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
		name: 'une de ces conditions',
		nodeKind: 'une de ces conditions',
		type: 'boolean'
	}
}

registerEvaluationFunction('une de ces conditions', evaluate)
