import { min } from 'ramda'
import { ASTNode } from '../AST/types'
import { evaluateArray } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export type MinNode = {
	explanation: Array<ASTNode>
	nodeKind: 'minimum'
}
export const mecanismMin = (v, context) => {
	const explanation = v.map((node) => parse(node, context))

	return {
		explanation,
		nodeKind: 'minimum',
	} as MinNode
}

const evaluate = evaluateArray<'minimum'>(min, Infinity)

registerEvaluationFunction('minimum', evaluate)
