import { EvaluatedNode } from './index'
import { serializeUnit } from './units'
export default function serializeEvaluation(
	node: EvaluatedNode
): string | undefined {
	if (typeof node.nodeValue === 'number') {
		const serializedUnit = serializeUnit(node.unit)
		return (
			'' +
			node.nodeValue +
			(serializedUnit ? serializedUnit.replace(/\s/g, '') : '')
		)
	} else if (typeof node.nodeValue === 'boolean') {
		return node.nodeValue ? 'oui' : 'non'
	} else if (typeof node.nodeValue === 'string') {
		return `'${node.nodeValue}'`
	}
}
