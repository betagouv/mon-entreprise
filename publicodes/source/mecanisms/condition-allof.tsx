import { is, map } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Mecanism } from '../components/mecanisms/common'
import { ASTNode } from '../AST/types'
import { makeJsx, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export type TouteCesConditionsNode = {
	explanation: Array<ASTNode>
	nodeKind: 'toutes ces conditions'
	jsx: any
}

const evaluate: evaluationFunction<'toutes ces conditions'> = function (node) {
	const [nodeValue, explanation] = node.explanation.reduce<
		[boolean | null, Array<ASTNode>]
	>(
		([nodeValue, explanation], node) => {
			if (nodeValue === false) {
				return [nodeValue, [...explanation, node]]
			}
			const evaluatedNode = this.evaluateNode(node)
			return [
				nodeValue === null || evaluatedNode.nodeValue === null
					? null
					: !!evaluatedNode.nodeValue,
				[...explanation, evaluatedNode],
			]
		},
		[true, []]
	)

	return {
		...node,
		nodeValue,
		explanation,
		missingVariables: mergeAllMissing(explanation),
	}
}

export const mecanismAllOf = (v, context) => {
	if (!is(Array, v)) throw new Error('should be array')
	const explanation = v.map((node) => parse(node, context))
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
		nodeKind: 'toutes ces conditions',
	}
}

registerEvaluationFunction('toutes ces conditions', evaluate)
