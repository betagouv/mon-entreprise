import { is, isEmpty, map, max, mergeWith, reduce } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Mecanism } from '../components/mecanisms/common'
import { ASTNode, EvaluatedNode, Evaluation } from '../AST/types'
import {
	collectNodeMissing,
	makeJsx,
	mergeAllMissing,
	mergeMissing
} from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { InternalError } from '../error'

export type UneDeCesConditionsNode = {
	explanation: Array<ASTNode>
	nodeKind: 'une de ces conditions'
	jsx: any
}

const evaluate: evaluationFunction<'une de ces conditions'> = function(node) {
	type Calculations = {
		explanation: Array<ASTNode | EvaluatedNode>
		nodeValue: Evaluation<boolean>
		missingVariables: Record<string, number>
	}
	const calculations = node.explanation.reduce<Calculations>(
		(acc, node) => {
			if (acc.nodeValue === true) {
				return {
					...acc,
					explanation: [...acc.explanation, node]
				}
			}
			if (acc.nodeValue === null || acc.nodeValue === false) {
				const evaluatedNode = this.evaluateNode(node)
				return {
					nodeValue: evaluatedNode.nodeValue
						? true
						: evaluatedNode.nodeValue === null
						? null
						: acc.nodeValue,
					missingVariables: evaluatedNode.nodeValue
						? {}
						: mergeMissing(
								acc.missingVariables,
								evaluatedNode.missingVariables
						  ),
					explanation: [...acc.explanation, evaluatedNode]
				}
			}
			throw new InternalError([node, acc])
		},
		{
			nodeValue: false,
			missingVariables: {},
			explanation: []
		}
	)
	return {
		...node,
		...calculations
	}
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
