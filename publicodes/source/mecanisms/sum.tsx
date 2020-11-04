import { ASTNode } from '../AST/types'
import Somme from '../components/mecanisms/Somme'
import { evaluateArray } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

const evaluate = evaluateArray<'somme'>(
	(x: any, y: any) => (x === false && y === false ? false : x + y),
	false
)

export type SommeNode = {
	explanation: Array<ASTNode>
	nodeKind: 'somme'
	jsx: any
}

export const mecanismSum = (v, context) => {
	const explanation = v.map(node => parse(node, context))
	return {
		jsx: Somme,
		explanation,
		nodeKind: 'somme'
	} as SommeNode
}

registerEvaluationFunction('somme', evaluate)
