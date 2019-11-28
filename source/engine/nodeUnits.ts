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
export const getNodeDefaultUnit = (node, cache, defaultUnit) =>
	node.unit ||
	cache._meta.defaultUnits.find(unit =>
		areUnitConvertible(defaultUnit || node.defaultUnit, unit)
	) ||
	node.defaultUnit

export function convertNodeToUnit(to: Unit, node) {
	return {
		...node,
		nodeValue: node.unit
			? convertUnit(node.unit, to, node.nodeValue)
			: node.nodeValue,
		unit: to
	}
}
