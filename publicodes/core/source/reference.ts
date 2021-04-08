import { InternalError } from './error'
import { registerEvaluationFunction } from './evaluationFunctions'
import { Context } from './parsePublicodes'

export type ReferenceNode = {
	nodeKind: 'reference'
	name: string
	contextDottedName: string
	dottedName?: string
}

export default function parseReference(
	v: string,
	context: Context
): ReferenceNode {
	return {
		nodeKind: 'reference',
		name: v,
		contextDottedName: context.dottedName,
	}
}

registerEvaluationFunction('reference', function evaluateReference(node) {
	if (!node.dottedName) {
		throw new InternalError(node)
	}

	const explanation = this.evaluate(this.parsedRules[node.dottedName])
	return {
		...node,
		missingVariables: explanation.missingVariables,
		nodeValue: explanation.nodeValue,
		...('unit' in explanation && { unit: explanation.unit }),
	}
})
