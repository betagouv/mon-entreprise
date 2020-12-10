import { is } from 'ramda'
import { EvaluationFunction } from '..'
import { ASTNode, EvaluatedNode, Evaluation } from '../AST/types'
import { mergeMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { InternalError } from '../error'

export type UneDeCesConditionsNode = {
	explanation: Array<ASTNode>
	nodeKind: 'une de ces conditions'
}

const evaluate: EvaluationFunction<'une de ces conditions'> = function (node) {
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
					explanation: [...acc.explanation, node],
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
					explanation: [...acc.explanation, evaluatedNode],
				}
			}
			throw new InternalError([node, acc])
		},
		{
			nodeValue: false,
			missingVariables: {},
			explanation: [],
		}
	)
	return {
		...node,
		...calculations,
	}
}

export const mecanismOneOf = (v, context) => {
	if (!is(Array, v)) throw new Error('should be array')
	const explanation = v.map((node) => parse(node, context))

	return {
		explanation,
		nodeKind: 'une de ces conditions',
	}
}

registerEvaluationFunction('une de ces conditions', evaluate)
