import { is, map, max, mergeWith, reduce } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Mecanism } from '../components/mecanisms/common'
import { ASTNode } from '../AST/types'
import { collectNodeMissing, makeJsx } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export type UneDeCesConditionsNode = {
	explanation: Array<ASTNode>
	nodeKind: 'une de ces conditions'
	jsx: any
}

const evaluate: evaluationFunction<'une de ces conditions'> = function(node) {
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

export const mecanismOneOf = (v, context) => {
	if (!is(Array, v)) throw new Error('should be array')
	const explanation = v.map(node => parse(node, context))
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
		nodeKind: 'une de ces conditions'
	}
}

registerEvaluationFunction('une de ces conditions', evaluate)
