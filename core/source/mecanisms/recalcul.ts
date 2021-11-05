import Engine, { EvaluationFunction } from '..'
import { ASTNode, EvaluatedNode } from '../AST/types'
import { defaultNode } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { ReferenceNode } from '../reference'
import { disambiguateRuleReference } from '../ruleUtils'
import { serializeUnit } from '../units'

export type RecalculNode = {
	explanation: {
		recalcul: ASTNode
		amendedSituation: Array<[ReferenceNode, ASTNode]>
		parsedSituation?: Engine['parsedSituation']
	}
	nodeKind: 'recalcul'
}

const evaluateRecalcul: EvaluationFunction<'recalcul'> = function (node) {
	if (this.cache._meta.inRecalcul) {
		return defaultNode(null) as any as RecalculNode & EvaluatedNode
	}

	const amendedSituation = node.explanation.amendedSituation
		.map(([originRule, replacement]) => [
			this.evaluate(originRule),
			this.evaluate(replacement),
		])
		.filter(
			([originRule, replacement]) =>
				originRule.nodeValue !== replacement.nodeValue ||
				serializeUnit(originRule.unit) !== serializeUnit(replacement.unit)
		) as Array<[ReferenceNode & EvaluatedNode, EvaluatedNode]>

	const engine = amendedSituation.length
		? this.shallowCopy().setSituation({
				...this.parsedSituation,
				...Object.fromEntries(
					amendedSituation.map(([reference, replacement]) => [
						disambiguateRuleReference(
							this.parsedRules,
							reference.contextDottedName,
							reference.name
						),
						replacement,
					]) as any
				),
		  })
		: this

	engine.cache._meta.inRecalcul = true
	const evaluatedNode = engine.evaluate(node.explanation.recalcul)
	engine.cache._meta.inRecalcul = false

	return {
		...node,
		nodeValue: evaluatedNode.nodeValue,
		explanation: {
			recalcul: evaluatedNode,
			amendedSituation,
			parsedSituation: engine.parsedSituation,
		},
		missingVariables: evaluatedNode.missingVariables,
		...('unit' in evaluatedNode && { unit: evaluatedNode.unit }),
	}
}

export const mecanismRecalcul = (v, context) => {
	const amendedSituation = Object.keys(v.avec).map((dottedName) => [
		parse(dottedName, context),
		parse(v.avec[dottedName], context),
	])
	const defaultRuleToEvaluate = context.dottedName
	const nodeToEvaluate = parse(v.règle ?? defaultRuleToEvaluate, context)
	return {
		explanation: {
			recalcul: nodeToEvaluate,
			amendedSituation,
		},
		nodeKind: 'recalcul',
	} as RecalculNode
}

registerEvaluationFunction('recalcul', evaluateRecalcul)
