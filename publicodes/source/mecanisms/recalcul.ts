import Recalcul from '../components/mecanisms/Recalcul'
import { defaultNode, evaluateNode } from '../evaluation'
import { serializeUnit } from '../units'

const evaluateRecalcul = (cache, situation, parsedRules, node) => {
	if (cache._meta.inRecalcul) {
		return defaultNode(false)
	}

	const amendedSituation = node.explanation.amendedSituation
		.map(([originRule, replacement]) => [
			evaluateNode(cache, situation, parsedRules, originRule),
			evaluateNode(cache, situation, parsedRules, replacement)
		])
		.filter(
			([originRule, replacement]) =>
				originRule.nodeValue !== replacement.nodeValue ||
				serializeUnit(originRule.unit) !== serializeUnit(replacement.unit)
		)

	// Optimisation : no need for recalcul if situation is the same
	const recalculCache = Object.keys(amendedSituation).length
		? { _meta: { ...cache._meta, inRecalcul: true } } // Create an empty cache
		: cache

	const evaluatedNode = evaluateNode(
		recalculCache,
		{
			...situation,
			...Object.fromEntries(
				amendedSituation.map(([originRule, replacement]) => [
					originRule.dottedName,
					replacement
				])
			)
		},
		parsedRules,
		node.explanation.recalcul
	)
	return {
		...node,
		nodeValue: evaluatedNode.nodeValue,
		...(evaluatedNode.temporalValue && {
			temporalValue: evaluatedNode.temporalValue
		}),
		unit: evaluatedNode.unit,
		explanation: {
			recalcul: evaluatedNode,
			amendedSituation
		}
	}
}

export const mecanismRecalcul = dottedNameContext => (recurse, v) => {
	const amendedSituation = Object.keys(v.avec).map(dottedName => [
		recurse(dottedName),
		recurse(v.avec[dottedName])
	])
	const defaultRuleToEvaluate = dottedNameContext
	const nodeToEvaluate = recurse(v.règle ?? defaultRuleToEvaluate)
	return {
		explanation: {
			recalcul: nodeToEvaluate,
			amendedSituation
		},
		jsx: Recalcul,
		evaluate: evaluateRecalcul
	}
}
