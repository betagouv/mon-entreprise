import { evaluationFunction } from '..'
import Recalcul from '../components/mecanisms/Recalcul'
import { defaultNode, registerEvaluationFunction } from '../evaluation'
import { EvaluatedNode } from '../types'
import { serializeUnit } from '../units'

const evaluateRecalcul: evaluationFunction = function(node) {
	if (this.cache._meta.inRecalcul) {
		return (defaultNode(false) as any) as EvaluatedNode
	}

	const amendedSituation = node.explanation.amendedSituation
		.map(([originRule, replacement]) => [
			this.evaluateNode(originRule),
			this.evaluateNode(replacement)
		])
		.filter(
			([originRule, replacement]) =>
				originRule.nodeValue !== replacement.nodeValue ||
				serializeUnit(originRule.unit) !== serializeUnit(replacement.unit)
		)

	const originalCache = this.cache
	const originalSituation = this.parsedSituation
	// Optimisation : no need for recalcul if situation is the same
	this.cache = Object.keys(amendedSituation).length
		? { _meta: { ...this.cache._meta, inRecalcul: true } } // Create an empty cache
		: this.cache
	this.parsedSituation = {
		...this.parsedSituation,
		...Object.fromEntries(
			amendedSituation.map(([originRule, replacement]) => [
				originRule.dottedName,
				replacement
			])
		)
	}

	const evaluatedNode = this.evaluateNode(node.explanation.recalcul)
	this.cache = originalCache
	this.parsedSituation = originalSituation
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

export const mecanismRecalcul = (recurse, v, dottedNameContext) => {
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
		nodeKind: 'recalcul'
	}
}

registerEvaluationFunction('recalcul', evaluateRecalcul)
