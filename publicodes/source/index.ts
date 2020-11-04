/* eslint-disable @typescript-eslint/ban-types */
import { map } from 'ramda'
import { ASTNode, EvaluationDecoration, NodeKind } from './AST/types'
import { evaluationFunctions } from './evaluationFunctions'
import parse from './parse'
import parsePublicodes, { disambiguateReference } from './parsePublicodes'
import { Rule, RuleNode } from './rule'
import * as utils from './ruleUtils'

const emptyCache = () => ({
	_meta: { contextRule: [] }
})

type Cache = {
	_meta: {
		contextRule: Array<string>
		parentEvaluationStack?: Array<string>
		inversionFail?:
			| {
					given: string
					estimated: string
			  }
			| true
		inRecalcul?: boolean
		filter?: string
	}
}

export type EvaluationOptions = Partial<{
	unit: string
}>

// export { default as cyclesLib } from './AST/index'
export * from './components'
export { formatValue, serializeValue } from './format'
export { default as translateRules } from './translateRules'
export { parsePublicodes }
export { utils }

export type evaluationFunction<Kind extends NodeKind = NodeKind> = (
	this: Engine,
	node: ASTNode & { nodeKind: Kind }
) => ASTNode & { nodeKind: Kind } & EvaluationDecoration
type ParsedRules<Name extends string> = Record<
	Name,
	RuleNode & { dottedName: Name }
>
export default class Engine<Name extends string = string> {
	parsedRules: ParsedRules<Name>
	parsedSituation: Record<string, ASTNode> = {}
	cache: Cache
	private warnings: Array<string> = []

	constructor(rules: string | Record<string, Rule> | Record<string, RuleNode>) {
		this.cache = emptyCache()
		this.resetCache()
		if (typeof rules === 'string') {
			this.parsedRules = parsePublicodes(rules) as ParsedRules<Name>
		}
		const firstRuleObject = Object.values(rules)[0] as Rule | RuleNode
		if (
			typeof firstRuleObject === 'object' &&
			firstRuleObject != null &&
			'nodeKind' in firstRuleObject
		) {
			this.parsedRules = rules as ParsedRules<Name>
			return
		}
		this.parsedRules = parsePublicodes(
			rules as Record<string, Rule>
		) as ParsedRules<Name>
	}

	private resetCache() {
		this.cache = emptyCache()
	}

	setSituation(
		situation: Partial<Record<Name, string | number | object>> = {}
	) {
		this.resetCache()
		this.parsedSituation = map(value => {
			return disambiguateReference(this.parsedRules)(
				parse(value, {
					dottedName: "'''situation",
					parsedRules: {}
				})
			)
		}, situation)
		return this
	}

	evaluate(
		expression: Name
	): RuleNode & EvaluationDecoration & { dottedName: Name }
	evaluate(expression: string): ASTNode & EvaluationDecoration {
		/*
			TODO
			EN ATTENDANT d'AVOIR une meilleure gestion d'erreur, on va mocker console.warn
		*/
		const originalWarn = console.warn

		console.warn = (warning: string) => {
			this.warnings.push(warning)
			originalWarn(warning)
		}
		if (this.parsedRules[expression]) {
			// TODO :  No replacement here. Is this what we want ?
			return this.evaluateNode(this.parsedRules[expression])
		}
		const result = this.evaluateNode(
			disambiguateReference(this.parsedRules)(
				parse(expression, {
					dottedName: "'''evaluation",
					parsedRules: {}
				})
			)
		)
		console.warn = originalWarn
		return result
	}

	getWarnings() {
		return this.warnings
	}

	inversionFail(): boolean {
		return !!this.cache._meta.inversionFail
	}

	getParsedRules(): Record<string, RuleNode> {
		return this.parsedRules
	}

	evaluateNode<N extends ASTNode = ASTNode>(node: N): N & EvaluationDecoration {
		if (!node.nodeKind) {
			throw Error('The provided node must have a "nodeKind" attribute')
		} else if (!evaluationFunctions[node.nodeKind]) {
			throw Error(`Unknown "nodeKind": ${node.nodeKind}`)
		}

		return evaluationFunctions[node.nodeKind].call(this, node)
	}
}
