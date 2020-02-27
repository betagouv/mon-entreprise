import { mapTemporal } from './period'
import {
	areUnitConvertible,
	convertUnit,
	simplifyUnitWithValue,
	Unit
} from './units'

export function simplifyNodeUnit(node) {
	if (!node.unit || !node.nodeValue) {
		return node
	}
	const [unit, nodeValue] = simplifyUnitWithValue(node.unit, node.nodeValue)
	return {
		...node,
		unit,
		nodeValue
	}
}
export const getNodeDefaultUnit = (node, cache) => {
	if (
		node.question &&
		node.unit == null &&
		node.defaultUnit == null &&
		node.formule?.unit == null
	) {
		return false
	}

	return (
		node.unit ||
		cache._meta.defaultUnits.find(unit =>
			areUnitConvertible(node.defaultUnit, unit)
		) ||
		node.defaultUnit
	)
}

export function convertNodeToUnit(to: Unit, node) {
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
