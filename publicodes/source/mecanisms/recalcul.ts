import { evaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import Recalcul from '../components/mecanisms/Recalcul'
import { defaultNode } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { ReferenceNode } from '../reference'
import { disambiguateRuleReference } from '../ruleUtils'
import { EvaluationDecoration } from '../AST/types'
import { serializeUnit } from '../units'

export type RecalculNode = {
	explanation: {
		recalcul: ASTNode
		amendedSituation: Array<[ReferenceNode, ASTNode]>
	}
	jsx: any
	nodeKind: 'recalcul'
}

const evaluateRecalcul: evaluationFunction<'recalcul'> = function(node) {
	if (this.cache._meta.inRecalcul) {
		return (defaultNode(false) as any) as RecalculNode & EvaluationDecoration
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
		) as Array<
		[ReferenceNode & EvaluationDecoration, ASTNode & EvaluationDecoration]
	>

	const originalCache = { ...this.cache }
	const originalSituation = { ...this.parsedSituation }
	// Optimisation : no need for recalcul if situation is the same
	this.cache = Object.keys(amendedSituation).length
		? { _meta: { ...this.cache._meta, inRecalcul: true } } // Create an empty cache
		: { ...this.cache }
	this.parsedSituation = {
		...this.parsedSituation,
		...Object.fromEntries(
			amendedSituation.map(([reference, replacement]) => [
				disambiguateRuleReference(
					this.parsedRules,
					reference.contextDottedName,
					reference.name
				),
				replacement
			]) as any
		)
	}

	const evaluatedNode = this.evaluateNode(node.explanation.recalcul)
	this.cache = originalCache
	this.parsedSituation = originalSituation
	return {
		...node,
		nodeValue: evaluatedNode.nodeValue,
		explanation: {
			recalcul: evaluatedNode,
			amendedSituation
		},
		missingVariables: evaluatedNode.missingVariables,
		...('unit' in evaluatedNode && { unit: evaluatedNode.unit }),
		...(evaluatedNode.temporalValue && {
			temporalValue: evaluatedNode.temporalValue
		})
	}
}

export const mecanismRecalcul = (v, context) => {
	const amendedSituation = Object.keys(v.avec).map(dottedName => [
		parse(dottedName, context),
		parse(v.avec[dottedName], context)
	])
	const defaultRuleToEvaluate = context.dottedName
	const nodeToEvaluate = parse(v.règle ?? defaultRuleToEvaluate, context)
	return {
		explanation: {
			recalcul: nodeToEvaluate,
			amendedSituation
		},
		jsx: Recalcul,
		nodeKind: 'recalcul'
	} as RecalculNode
}

registerEvaluationFunction('recalcul', evaluateRecalcul)
