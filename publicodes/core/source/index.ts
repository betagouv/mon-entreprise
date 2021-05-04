import { reduceAST } from './AST'
import { ASTNode, EvaluatedNode, NodeKind } from './AST/types'
import { evaluationFunctions } from './evaluationFunctions'
import parse from './parse'
import parsePublicodes, { disambiguateReference } from './parsePublicodes'
import {
	getReplacements,
	inlineReplacements,
	ReplacementRule,
} from './replacement'
import { Rule, RuleNode } from './rule'
import * as utils from './ruleUtils'
import { formatUnit, getUnitKey } from './units'

const emptyCache = (): Cache => ({
	_meta: {
		parentRuleStack: [],
		evaluationRuleStack: [],
	},
	nodes: new Map(),
})

type Cache = {
	_meta: {
		parentRuleStack: Array<string>
		evaluationRuleStack: Array<string>
		inversionFail?:
			| {
					given: string
					estimated: string
			  }
			| true
		inRecalcul?: boolean
		filter?: string
	}
	nodes: Map<PublicodesExpression | ASTNode, EvaluatedNode>
}

export type EvaluationOptions = Partial<{
	unit: string
}>

export { reduceAST, makeASTTransformer as transformAST } from './AST/index'
export { Evaluation, Unit } from './AST/types'
export { capitalise0, formatValue } from './format'
export { simplifyNodeUnit } from './nodeUnits'
export { default as serializeEvaluation } from './serializeEvaluation'
export { parseUnit, serializeUnit } from './units'
export { parsePublicodes, utils }
export { Rule, RuleNode, ASTNode, EvaluatedNode }

type PublicodesExpression = string | Record<string, unknown> | number

export type Logger = {
	log(message: string): void
	warn(message: string): void
	error(message: string): void
}

type Options = {
	logger: Logger
	getUnitKey?: getUnitKey
	formatUnit?: formatUnit
}

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
	options: Options

	constructor(
		rules: string | Record<string, Rule> = {},
		options: Partial<Options> = {}
	) {
		this.options = { ...options, logger: options.logger ?? console }
		this.parsedRules = parsePublicodes(rules, this.options) as ParsedRules<Name>
		this.replacements = getReplacements(this.parsedRules)
	}

	setOptions(options: Partial<Options>) {
		this.options = { ...this.options, ...options }
	}

	resetCache() {
		this.cache = emptyCache()
	}

	setSituation(
		situation: Partial<Record<Name, PublicodesExpression | ASTNode>> = {}
	) {
		this.resetCache()
		this.parsedSituation = Object.fromEntries(
			Object.entries(situation).map(([key, value]) => {
				if (value && typeof value === 'object' && 'nodeKind' in value) {
					return [key, value as ASTNode]
				}
				const parsedValue =
					value && typeof value === 'object' && 'nodeKind' in value
						? (value as ASTNode)
						: this.parse(value, {
								dottedName: `situation [${key}]`,
								parsedRules: {},
								...this.options,
						  })
				return [key, parsedValue]
			})
		)
		return this
	}

	private parse(...args: Parameters<typeof parse>) {
		return inlineReplacements(
			this.replacements,
			this.options.logger
		)(disambiguateReference(this.parsedRules)(parse(...args)))
	}

	inversionFail(): boolean {
		return !!this.cache._meta.inversionFail
	}

	getRule(dottedName: Name): ParsedRules<Name>[Name] {
		if (!(dottedName in this.parsedRules)) {
			throw new Error(`La règle '${dottedName}' n'existe pas`)
		}
		return this.parsedRules[dottedName]
	}

	getParsedRules(): ParsedRules<Name> {
		return this.parsedRules
	}

	getOptions(): Options {
		return this.options
	}

	evaluate<N extends ASTNode = ASTNode>(value: N): N & EvaluatedNode
	evaluate(value: PublicodesExpression): EvaluatedNode
	evaluate(value: PublicodesExpression | ASTNode): EvaluatedNode {
		const cachedNode = this.cache.nodes.get(value)
		if (cachedNode !== undefined) {
			return cachedNode
		}

		let parsedNode: ASTNode
		if (!value || typeof value !== 'object' || !('nodeKind' in value)) {
			parsedNode = this.parse(value, {
				dottedName: 'evaluation',
				parsedRules: {},
				...this.options,
			})
		} else {
			parsedNode = value as ASTNode
		}

		if (!evaluationFunctions[parsedNode.nodeKind]) {
			throw Error(`Unknown "nodeKind": ${parsedNode.nodeKind}`)
		}

		const evaluatedNode = evaluationFunctions[parsedNode.nodeKind].call(
			this,
			parsedNode
		)
		this.cache.nodes.set(value, evaluatedNode)
		return evaluatedNode
	}

	/**
	 * Shallow Engine instance copy. Keeps references to the original Engine instance attributes.
	 */
	shallowCopy(): Engine<Name> {
		const newEngine = new Engine<Name>()
		newEngine.options = this.options
		newEngine.parsedRules = this.parsedRules
		newEngine.replacements = this.replacements
		newEngine.parsedSituation = this.parsedSituation
		newEngine.cache = this.cache
		return newEngine
	}
}

/**
 	This function allows to mimic the former 'isApplicable' property on evaluatedRules

	It will be deprecated when applicability will be encoded as a Literal type
*/
export function UNSAFE_isNotApplicable<DottedName extends string = string>(
	engine: Engine<DottedName>,
	dottedName: DottedName
): boolean {
	const rule = engine.getRule(dottedName)
	return reduceAST<boolean>(
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
				return fn(engine.evaluate(rule))
			}
			if (node.nodeKind === 'applicable si') {
				return (
					(node.explanation.condition as any).nodeValue === false ||
					fn(node.explanation.valeur)
				)
			}
			if (node.nodeKind === 'non applicable si') {
				return (
					(node.explanation.condition as any).nodeValue !== false &&
					(node.explanation.condition as any).nodeValue !== null
				)
			}
			if (node.nodeKind === 'rule') {
				return (
					(node.explanation.parent as any).nodeValue === false ||
					fn(node.explanation.valeur)
				)
			}
		},
		false,
		engine.evaluate(dottedName)
	)
}
