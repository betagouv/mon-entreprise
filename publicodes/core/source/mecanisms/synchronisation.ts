import { EvaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'

export type SynchronisationNode = {
	explanation: {
		chemin: string
		data: ASTNode
	}
	nodeKind: 'synchronisation'
}

const evaluate: EvaluationFunction<'synchronisation'> = function (node: any) {
	const data = this.evaluate(node.explanation.data)
	const valuePath = node.explanation.chemin.split(' . ')
	const path = (obj) => valuePath.reduce((res, prop) => res[prop], obj)
	const nodeValue = data.nodeValue == null ? null : path(data.nodeValue)

	const missingVariables = {
		...data.missingVariables,
		...(data.nodeValue === null ? { [data.dottedName]: 1 } : {}),
	}

	const explanation = { ...node.explanation, data }
	return { ...node, nodeValue, explanation, missingVariables }
}

export const mecanismSynchronisation = (v, context) => {
	return {
		// TODO : expect API exists ?
		explanation: { ...v, data: parse(v.data, context) },
		nodeKind: 'synchronisation',
	} as SynchronisationNode
}

registerEvaluationFunction('synchronisation', evaluate)
