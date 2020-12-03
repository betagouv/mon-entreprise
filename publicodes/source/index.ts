/* eslint-disable @typescript-eslint/ban-types */
import { compose, mapObjIndexed } from 'ramda'
import { ASTNode, EvaluatedNode, NodeKind } from './AST/types'
import { evaluationFunctions } from './evaluationFunctions'
import { simplifyNodeUnit } from './nodeUnits'
import parse from './parse'
import parsePublicodes, { disambiguateReference } from './parsePublicodes'
import {
	getReplacements,
	inlineReplacements,
	ReplacementNode
} from './replacement'
import { Rule, RuleNode } from './rule'
import * as utils from './ruleUtils'

const emptyCache = () => ({
	_meta: { contextRule: [] },
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

export { reduceAST, transformAST } from './AST'
export * as cyclesLib from './AST/graph'
export { Evaluation, Unit } from './AST/types'
export * from './components'
export { formatValue } from './format'
export { default as translateRules } from './translateRules'
export { ASTNode, EvaluatedNode }
export { parsePublicodes }
export { utils }
export { Rule }

export type evaluationFunction<Kind extends NodeKind = NodeKind> = (
	this: Engine,
	node: ASTNode & { nodeKind: Kind }
) => ASTNode & { nodeKind: Kind } & EvaluatedNode
export type ParsedRules<Name extends string> = Record<
	Name,
	RuleNode & { dottedName: Name }
>
export default class Engine<Name extends string = string> {
	parsedRules: ParsedRules<Name>
	parsedSituation: Record<string, ASTNode> = {}
	replacements: Record<string, Array<ReplacementNode>> = {}
	cache: Cache
	private warnings: Array<string> = []

	constructor(rules: string | Record<string, Rule> | ParsedRules<Name>) {
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
		this.replacements = getReplacements(this.parsedRules)
	}

	private resetCache() {
		this.cache = emptyCache()
	}

	setSituation(
		situation: Partial<Record<Name, string | number | object | ASTNode>> = {}
	) {
		this.resetCache()
		this.parsedSituation = mapObjIndexed((value, key) => {
			if (value && typeof value === 'object' && 'nodeKind' in value) {
				return value as ASTNode
			}
			return compose(
				inlineReplacements(this.replacements),
				disambiguateReference(this.parsedRules)
			)(
				parse(value, {
					dottedName: `situation [${key}]`,
					parsedRules: {},
				})
			)
		}, situation)
		return this
	}

	evaluate(expression: string | Object): EvaluatedNode {
		/*
			TODO
			EN ATTENDANT d'AVOIR une meilleure gestion d'erreur, on va mocker console.warn
		*/
		const originalWarn = console.warn

		console.warn = (warning: string) => {
			this.warnings.push(warning)
			originalWarn(warning)
		}
		const result = this.evaluateNode(
			compose(
				inlineReplacements(this.replacements),
				disambiguateReference(this.parsedRules)
			)(
				parse(expression, {
					dottedName: "evaluation'''",
					parsedRules: {},
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

	getParsedRules(): ParsedRules<Name> {
		return this.parsedRules
	}

	evaluateNode<N extends ASTNode = ASTNode>(node: N): N & EvaluatedNode {
		if (!node.nodeKind) {
			throw Error('The provided node must have a "nodeKind" attribute')
		} else if (!evaluationFunctions[node.nodeKind]) {
			throw Error(`Unknown "nodeKind": ${node.nodeKind}`)
		}

		return evaluationFunctions[node.nodeKind].call(this, node)
	}
}

// This function is an util for allowing smother migration to the new Engine API
export function evaluateRule<DottedName extends string = string>(
	engine: Engine<DottedName>,
	dottedName: DottedName,
	modifiers: Object = {}
): EvaluatedRule<DottedName> {
	const evaluation = simplifyNodeUnit(
		engine.evaluate({ valeur: dottedName, ...modifiers })
	)
	const rule = engine.getParsedRules()[dottedName] as RuleNode & {
		dottedName: DottedName
	}
	return {
		...rule.rawNode,
		...rule,
		...evaluation,
	} as EvaluatedRule<DottedName>
}

export type EvaluatedRule<Name extends string = string> = EvaluatedNode &
	Omit<
		(ASTNode & {
			nodeKind: 'rule'
		}) &
			(ASTNode & {
				nodeKind: 'rule'
			})['rawNode'] & { dottedName: Name },
		'nodeKind'
	>
