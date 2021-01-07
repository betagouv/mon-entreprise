import { ASTNode, EvaluatedNode } from './AST/types'
import { bonus, mergeMissing } from './evaluation'
import { registerEvaluationFunction } from './evaluationFunctions'
import parse, { mecanismKeys } from './parse'
import { Context } from './parsePublicodes'
import { ReferenceNode } from './reference'
import {
	parseRendNonApplicable,
	parseReplacements,
	ReplacementRule,
} from './replacement'
import { nameLeaf, ruleParents } from './ruleUtils'
import { capitalise0 } from './format'

export type Rule = {
	formule?: Record<string, unknown> | string
	question?: string
	description?: string
	unité?: string
	acronyme?: string
	exemples?: any
	nom: string
	résumé?: string
	icônes?: string
	titre?: string
	sévérité?: string
	cotisation?: {
		branche: string
	}
	type?: string
	note?: string
	remplace?: RendNonApplicable | Array<RendNonApplicable>
	'rend non applicable'?: Remplace | Array<string>
	suggestions?: Record<string, string | number | Record<string, unknown>>
	références?: { [source: string]: string }
	API?: string
	'identifiant court'?: string
}

type Remplace =
	| {
			règle: string
			par?: Record<string, unknown> | string | number
			dans?: Array<string> | string
			'sauf dans'?: Array<string> | string
	  }
	| string
type RendNonApplicable = Exclude<Remplace, { par: any }>

export type RuleNode = {
	dottedName: string
	title: string
	nodeKind: 'rule'
	virtualRule: boolean
	rawNode: Rule
	replacements: Array<ReplacementRule>
	explanation: {
		parent: ASTNode | false
		valeur: ASTNode
	}
	suggestions: Record<string, ASTNode>
	'identifiant court'?: string
}

export default function parseRule(
	rawRule: Rule,
	context: Context
): ReferenceNode {
	const dottedName = [context.dottedName, rawRule.nom]
		.filter(Boolean)
		.join(' . ')

	const name = nameLeaf(dottedName)
	const ruleTitle = capitalise0(
		rawRule['titre'] ??
			(context.ruleTitle ? `${context.ruleTitle} (${name})` : name)
	)

	if (context.parsedRules[dottedName]) {
		throw new Error(`La référence '${dottedName}' a déjà été définie`)
	}

	const ruleValue = {
		...Object.fromEntries(
			Object.entries(rawRule).filter(([key]) => mecanismKeys.includes(key))
		),
		...('formule' in rawRule && { valeur: rawRule.formule }),
		'nom dans la situation': dottedName,
	}

	const ruleContext = { ...context, dottedName, ruleTitle }

	const [parent] = ruleParents(dottedName)
	const explanation = {
		valeur: parse(ruleValue, ruleContext),
		parent: !!parent && parse(parent, context),
	}
	context.parsedRules[dottedName] = {
		dottedName,
		replacements: [
			...parseRendNonApplicable(rawRule['rend non applicable'], ruleContext),
			...parseReplacements(rawRule.remplace, ruleContext),
		],
		title: ruleTitle,
		suggestions: Object.fromEntries(
			Object.entries(rawRule.suggestions ?? {}).map(([name, node]) => [
				name,
				parse(node, ruleContext),
			])
		),
		nodeKind: 'rule',
		explanation,
		rawNode: rawRule,
		virtualRule: !!context.dottedName,
	} as RuleNode

	// We return the parsedReference
	return parse(rawRule.nom, context) as ReferenceNode
}

registerEvaluationFunction('rule', function evaluate(node) {
	if (this.cache[node.dottedName]) {
		return this.cache[node.dottedName]
	}
	const explanation = { ...node.explanation }

	const verifyParentApplicability = !this.cache._meta.ruleStack.includes(
		node.dottedName
	)
	this.cache._meta.ruleStack.unshift(node.dottedName)
	let parent: EvaluatedNode | null = null
	if (explanation.parent && verifyParentApplicability) {
		parent = this.evaluate(explanation.parent) as EvaluatedNode
		explanation.parent = parent
	}
	let valeur: EvaluatedNode | null = null
	if (!parent || parent.nodeValue !== false) {
		valeur = this.evaluate(explanation.valeur) as EvaluatedNode
		explanation.valeur = valeur
	}
	const evaluation = {
		...node,
		explanation,
		nodeValue: valeur && 'nodeValue' in valeur ? valeur.nodeValue : false,
		missingVariables: mergeMissing(
			valeur?.missingVariables,
			bonus(parent?.missingVariables)
		),
		...(valeur && 'unit' in valeur && { unit: valeur.unit }),
	}
	this.cache._meta.ruleStack.shift()
	this.cache[node.dottedName] = evaluation
	return evaluation
})
