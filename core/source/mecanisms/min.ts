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

const min = (a, b) => {
	if (a === false) {
		return b
	}
	if (b === false) {
		return a
	}
	if (a === null || b === null) {
		return null
	}
	return Math.min(a, b)
}
const evaluate = evaluateArray<'minimum'>(min, false)

registerEvaluationFunction('minimum', evaluate)
