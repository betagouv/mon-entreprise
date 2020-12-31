/* eslint-disable @typescript-eslint/ban-types */
import { ASTNode, EvaluatedNode, NodeKind } from './AST/types'
import { evaluationFunctions } from './evaluationFunctions'
import { simplifyNodeUnit } from './nodeUnits'
import parse from './parse'
import parsePublicodes, {
	Context,
	disambiguateReference,
} from './parsePublicodes'
import {
	getReplacements,
	inlineReplacements,
	ReplacementRule,
} from './replacement'
import { Rule, RuleNode } from './rule'
import * as utils from './ruleUtils'
import { reduceAST } from './AST'
import mecanismsDoc from '../../docs/mecanisms.yaml'

const emptyCache = () => ({
	_meta: { contextRule: [] },
	nodes: new Map(),
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
	nodes: Map<ASTNode, EvaluatedNode>
}

export type EvaluationOptions = Partial<{
	unit: string
}>

export { reduceAST, transformAST } from './AST/index'
export * as cyclesLib from './AST/graph'
export { Evaluation, Unit } from './AST/types'
export { formatValue, capitalise0 } from './format'
export { serializeUnit } from './units'
export { simplifyNodeUnit } from './nodeUnits'
export { ASTNode, EvaluatedNode }
export { parsePublicodes }
export { mecanismsDoc }
export { utils }
export { Rule }

export type EvaluationFunction<Kind extends NodeKind = NodeKind> = (
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
	replacements: Record<string, Array<ReplacementRule>> = {}
	cache: Cache = emptyCache()
	options: Context['options']
	private warnings: Array<string> = []

	constructor(
		rules: string | Record<string, Rule> | ParsedRules<Name>,
		options: Context['options'] = {}
	) {
		if (typeof rules === 'string') {
			this.parsedRules = parsePublicodes(rules, {
				options,
			}) as ParsedRules<Name>
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
		this.options = options
		this.parsedRules = parsePublicodes(rules as Record<string, Rule>, {
			options,
		}) as ParsedRules<Name>
		this.replacements = getReplacements(this.parsedRules)
	}

	resetCache() {
		this.cache = emptyCache()
	}

	setSituation(
		situation: Partial<Record<Name, string | number | object | ASTNode>> = {}
	) {
		this.resetCache()
		this.parsedSituation = Object.fromEntries(
			Object.entries(situation).map(([key, value]) => {
				const parsedValue =
					value && typeof value === 'object' && 'nodeKind' in value
						? (value as ASTNode)
						: this.parse(value, {
								dottedName: `situation [${key}]`,
								parsedRules: {},
								options: this.options,
						  })
				return [key, parsedValue]
			})
		)
		return this
	}

	private parse(...args: Parameters<typeof parse>) {
		return inlineReplacements(this.replacements)(
			disambiguateReference(this.parsedRules)(parse(...args))
		)
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
			this.parse(expression, {
				dottedName: "evaluation'''",
				parsedRules: {},
				options: this.options,
			})
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

	evaluateNode<N extends ASTNode = ASTNode>(
		node: N & { evaluationId?: string }
	): N & EvaluatedNode {
		if (!node.nodeKind) {
			throw Error('The provided node must have a "nodeKind" attribute')
		} else if (!evaluationFunctions[node.nodeKind]) {
			throw Error(`Unknown "nodeKind": ${node.nodeKind}`)
		}
		let result = this.cache.nodes.get(node)
		if (result === undefined) {
			result = evaluationFunctions[node.nodeKind].call(this, node)
		}
		this.cache.nodes.set(node, result!)
		return result as N & EvaluatedNode
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

	// HACK while waiting for applicability to have its own type
	const isNotApplicable = reduceAST<boolean>(
		function (isNotApplicable, node, fn) {
			if (isNotApplicable) return isNotApplicable
			if (!('nodeValue' in node)) {
				return isNotApplicable
			}
			if (node.nodeKind === 'variations') {
				return node.explanation.some(
					({ consequence }) =>
						fn(consequence) ||
						((consequence as any).nodeValue === false &&
							(consequence as any).dottedName !== dottedName)
				)
			}
			if (node.nodeKind === 'reference' && node.dottedName === dottedName) {
				return fn(engine.evaluateNode(rule))
			}
			if (node.nodeKind === 'applicable si') {
				return (node.explanation.condition as any).nodeValue === false
			}
			if (node.nodeKind === 'non applicable si') {
				return (
					(node.explanation.condition as any).nodeValue !== false &&
					(node.explanation.condition as any).nodeValue !== null
				)
			}
		},
		false,
		evaluation
	)
	return {
		isNotApplicable,
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
			})['rawNode'] & { dottedName: Name; isNotApplicable: boolean },
		'nodeKind'
	>
