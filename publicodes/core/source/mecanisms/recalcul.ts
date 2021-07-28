import Engine, { EvaluationFunction } from '..'
import { ASTNode, EvaluatedNode } from '../AST/types'
import { warning } from '../error'
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
		subEngineId: number
	}
	nodeKind: 'recalcul'
}

const evaluateRecalcul: EvaluationFunction<'recalcul'> = function (node) {
	// Caveat: for now, any nested recalcul is not applied. Ideally, we should
	// only prevent nested recalculs when a cycle appears, or even do this
	// statically. The only case which seems legit for now is when a rule is
	// recalcul-ing itself.
	if (this.cache._meta.currentRecalcul) {
		if (
			node.explanation.recalcul &&
			this.cache._meta.currentRecalcul !== node.explanation.recalcul
		) {
			warning(
				this.options.logger,
				this.cache._meta.evaluationRuleStack[0],
				`Un recalcul imbriqué a été tenté à l'intérieur du recalcul ${this.cache._meta.currentRecalcul}. La valeur null (non défini) est retournée.`
			)
		}
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

	engine.cache._meta.currentRecalcul = node.explanation.recalcul
	const evaluatedNode = engine.evaluate(node.explanation.recalcul)
	delete engine.cache._meta.currentRecalcul

	return {
		...node,
		nodeValue: evaluatedNode.nodeValue,
		explanation: {
			recalcul: evaluatedNode,
			amendedSituation,
			parsedSituation: engine.parsedSituation,
			subEngineId: engine.subEngineId as number,
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

	// Caveat: v.règle can theoretically be an expression, not necessarily
	// a dotted name.
	const recalculNode = parse(v.règle ?? context.dottedName, context)
	return {
		explanation: {
			recalcul: recalculNode,
			amendedSituation,
		},
		nodeKind: 'recalcul',
	} as RecalculNode
}

registerEvaluationFunction('recalcul', evaluateRecalcul)
