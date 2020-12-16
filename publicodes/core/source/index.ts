/* eslint-disable @typescript-eslint/ban-types */
import { compose, mapObjIndexed } from 'ramda'
import { reduceAST } from './AST'
import { ASTNode, EvaluatedNode, NodeKind } from './AST/types'
import { evaluationFunctions } from './evaluationFunctions'
import { simplifyNodeUnit } from './nodeUnits'
import parse from './parse'
import parsePublicodes, { disambiguateReference } from './parsePublicodes'
import {
	getReplacements,
	inlineReplacements,
	ReplacementRule,
} from './replacement'
import { Rule, RuleNode } from './rule'
import * as utils from './ruleUtils'
<<<<<<< HEAD:publicodes/core/source/index.ts
import { reduceAST } from './AST'
import mecanismsDoc from '../../docs/mecanisms.yaml'
=======
>>>>>>> 2c06fb45 (:fire: Ajoute la possibilité de définir un logger pour l'engine):publicodes/source/index.ts

const emptyCache = () => ({
	_meta: { ruleStack: [] },
	nodes: new Map(),
})

type Cache = {
	_meta: {
		ruleStack: Array<string>
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
	nodes: Map<PublicodesExpression | ASTNode, EvaluatedNode>
}

export type EvaluationOptions = Partial<{
	unit: string
}>

export * as cyclesLib from './AST/graph'
export { reduceAST, transformAST } from './AST/index'
export { Evaluation, Unit } from './AST/types'
export { formatValue, capitalise0 } from './format'
export { serializeUnit } from './units'
export { simplifyNodeUnit } from './nodeUnits'
export { default as translateRules } from './translateRules'
export { ASTNode, EvaluatedNode }
export { parsePublicodes }
export { mecanismsDoc }
export { utils }
export { Rule }

type PublicodesExpression = string | Record<string, unknown> | number

export type Logger = {
	log(message: string): void
	warn(message: string): void
	error(message: string): void
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
	logger: Logger = console

	constructor(
		rules: string | Record<string, Rule> | ParsedRules<Name>,
		logger?: Logger
	) {
		if (logger) {
			this.logger = logger
		}
		if (typeof rules === 'string') {
			rules = parsePublicodes(rules, {
				logger: this.logger,
			}) as ParsedRules<Name>
		}
		const firstRuleObject = Object.values(rules)[0] as Rule | RuleNode
		if (
			typeof firstRuleObject !== 'object' ||
			firstRuleObject == null ||
			!('nodeKind' in firstRuleObject)
		) {
			rules = parsePublicodes(rules as Record<string, Rule>, {
				logger: this.logger,
			}) as ParsedRules<Name>
		}
		this.parsedRules = rules as ParsedRules<Name>
		this.replacements = getReplacements(this.parsedRules)
	}

	setLogger(logger: Logger) {
		this.logger = logger
	}

	resetCache() {
		this.cache = emptyCache()
	}

	setSituation(
		situation: Partial<Record<Name, PublicodesExpression | ASTNode>> = {}
	) {
		this.resetCache()
		this.parsedSituation = mapObjIndexed((value, key) => {
			if (value && typeof value === 'object' && 'nodeKind' in value) {
				return value as ASTNode
			}
			return compose(
				inlineReplacements(this.replacements, this.logger),
				disambiguateReference(this.parsedRules)
			)(
				parse(value, {
					dottedName: `situation [${key}]`,
					parsedRules: {},
					logger: this.logger,
				})
			)
		}, situation)
		return this
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

	getRules(): ParsedRules<Name> {
		return this.parsedRules
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
			parsedNode = compose(
				inlineReplacements(this.replacements, this.logger),
				disambiguateReference(this.parsedRules)
			)(
				parse(value, {
					dottedName: `evaluation`,
					parsedRules: {},
					logger: this.logger,
				})
			)
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
}

/**
 	This function allows smother migration to the new Engine API

	It will be deprecated when applicability will be encoded as a Literal type
	Prefer the use of `engine.evaluate(engine.getRule(dottedName))`
*/
export function UNSAFE_evaluateRule<DottedName extends string = string>(
	engine: Engine<DottedName>,
	dottedName: DottedName,
	modifiers: Object = {}
): EvaluatedRule<DottedName> {
	const evaluation = simplifyNodeUnit(
		engine.evaluate({ valeur: dottedName, ...modifiers })
	)
	const rule = engine.getRule(dottedName) as RuleNode & {
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
				return fn(engine.evaluate(rule))
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
