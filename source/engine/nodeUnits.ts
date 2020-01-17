import { EvaluatedNode, mapTemporal } from './temporal'
import { convertUnit, simplifyUnitWithValue, Unit } from './units'

export function simplifyNodeUnit(node) {
	if (!node.unit || node.nodeValue === false || node.nodeValue == null) {
		return node
	}
	const [unit, nodeValue] = simplifyUnitWithValue(node.unit, node.nodeValue)

	return {
		...node,
		unit,
		nodeValue
	}
}
export const getNodeDefaultUnit = node => {
	if (node.question && node.unit == null && node.formule?.unit == null) {
		return false
	}

	return node.unit
}

export function convertNodeToUnit(to: Unit, node: EvaluatedNode<number>) {
	return {
		...node,
		nodeValue: node.unit
			? convertUnit(node.unit, to, node.nodeValue)
			: node.nodeValue,
		temporalValue:
			node.temporalValue && node.unit
				? mapTemporal(
						value => convertUnit(node.unit, to, value),
						node.temporalValue
				  )
				: node.temporalValue,
		unit: to
	}
}
