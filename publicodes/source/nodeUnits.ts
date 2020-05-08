import { mapTemporal } from './temporal'
import { convertUnit, simplifyUnit } from './units'
import { EvaluatedNode, Unit } from './types'

export function simplifyNodeUnit(node) {
	if (!node.unit) {
		return node
	}
	const unit = simplifyUnit(node.unit)

	return convertNodeToUnit(unit, node)
}

export function convertNodeToUnit<Names extends string>(
	to: Unit,
	node: EvaluatedNode<Names, number>
) {
	const temporalValue =
		node.temporalValue && node.unit
			? mapTemporal(
					value => convertUnit(node.unit, to, value),
					node.temporalValue
			  )
			: node.temporalValue
	return {
		...node,
		nodeValue: node.unit
			? convertUnit(node.unit, to, node.nodeValue)
			: node.nodeValue,
		...(temporalValue && { temporalValue }),
		unit: to
	}
}
