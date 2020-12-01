import { evaluationFunction } from '.'
import { ASTNode } from './AST/types'

export let evaluationFunctions = {
	constant: (node) => node,
} as any

export function registerEvaluationFunction<
	NodeName extends ASTNode['nodeKind']
>(nodeKind: NodeName, evaluationFunction: evaluationFunction<NodeName>) {
	evaluationFunctions ??= {}
	if (evaluationFunctions[nodeKind]) {
		throw Error(
			`Multiple evaluation functions registered for the nodeKind \x1b[4m${nodeKind}`
		)
	}
	evaluationFunctions[nodeKind] = evaluationFunction
}
