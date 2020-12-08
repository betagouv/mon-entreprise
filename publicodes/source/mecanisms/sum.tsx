import { ASTNode } from '../AST/types'
import { evaluateArray } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

const evaluate = evaluateArray<'somme'>((x: any, y: any) => x + y, 0)

export type SommeNode = {
	explanation: Array<ASTNode>
	nodeKind: 'somme'
}

export const mecanismSum = (v, context) => {
	const explanation = v.map((node) => parse(node, context))
	return {
		explanation,
		nodeKind: 'somme',
	} as SommeNode
}

registerEvaluationFunction('somme', evaluate)
