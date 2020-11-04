import { filter, map, mapObjIndexed, pick } from 'ramda'
import { ASTNode, EvaluationDecoration } from './AST/types'
import RuleComponent from './components/rule/Rule'
import { bonus, mergeMissing } from './evaluation'
import { registerEvaluationFunction } from "./evaluationFunctions"
import parseNonApplicable from './mecanisms/nonApplicable'
import parse, { mecanismKeys } from './parse'
import { Context } from './parsePublicodes'
import { parseRendNonApplicable, parseReplacements, ReplacementNode } from './replacement'
import { nameLeaf, ruleParents } from './ruleUtils'
import { capitalise0 } from './utils'

export type Rule = {
	formule?: Object | string
	question?: string
	description?: string
	unité?: string
	acronyme?: string
	exemples?: any
	nom: string
	résumé?: string
	'icônes'?: string
	titre?: string
	type?: string
	note?: string
	remplace?: RendNonApplicable | Array<RendNonApplicable>
	'rend non applicable'?: Remplace | Array<string>
	suggestions?: Record<string, string | number | object>
	références?: { [source: string]: string }
}
type Remplace = {
	règle: string
	par?: Object | string | number
	dans?: Array<string> | string
	'sauf dans'?: Array<string> | string
} | string
type RendNonApplicable = Exclude<Remplace, {par: any}>

export type RuleNode = {
	dottedName: string
	title: string
	nodeKind: "rule"
	jsx: any
	rawNode: Rule,
	replacements: Array<ReplacementNode>
	explanation: {
		parent: ASTNode | false
		valeur: ASTNode
	}
	suggestions: Record<string, ASTNode>
	dependencies: Array<string>
}

export default function parseRule(
	rawRule: Rule,
	context: Context
): RuleNode {
	const dottedName = [context.dottedName, rawRule.nom]
			.filter(Boolean)
			.join(' . ')

	if (context.parsedRules[dottedName]) {
		throw new Error(`La référence '${dottedName}' a déjà été définie`)
	}
		
	const ruleValue = {
		...pick(mecanismKeys, rawRule),
		...('formule' in rawRule && { valeur: rawRule.formule }),
		'nom dans la situation': dottedName
	}
	
	const ruleContext = { ...context, dottedName }
	const name = nameLeaf(dottedName)
	const [parent] = ruleParents(dottedName)
	const explanation = {
		valeur: parse(ruleValue, ruleContext),
		parent: !!parent && parse(parent, context),
	}
	context.parsedRules[dottedName] = filter(Boolean, {
		dottedName,
		replacements: [
			...parseRendNonApplicable(rawRule["rend non applicable"], ruleContext),
			...parseReplacements(rawRule.remplace, ruleContext), 
		],
		title: capitalise0(rawRule['titre'] || name),
		suggestions: mapObjIndexed(node => parse(node, ruleContext), rawRule.suggestions ?? {}),
		nodeKind: "rule",
		jsx: RuleComponent,
		explanation,
		rawNode: rawRule,
		dependencies: [] as Array<string> // TODO
	}) as RuleNode

	return context.parsedRules[dottedName]
}
	

registerEvaluationFunction('rule', function evaluate(node) {
	if (this.cache[node.dottedName]) {
		return this.cache[node.dottedName]
	}
	const explanation = { ...node.explanation }
	
	this.cache._meta.parentEvaluationStack ??= []
	
	let parent: ASTNode & EvaluationDecoration | null = null
	if (explanation.parent && !this.cache._meta.parentEvaluationStack.includes(node.dottedName)) {
		this.cache._meta.parentEvaluationStack.push(node.dottedName)
		parent = this.evaluateNode(explanation.parent) as ASTNode & EvaluationDecoration
		explanation.parent = parent 
		this.cache._meta.parentEvaluationStack.pop()
	}
	let valeur: ASTNode & EvaluationDecoration | null = null
	if (!parent || parent.nodeValue !== false) {
		valeur = this.evaluateNode(explanation.valeur) as ASTNode & EvaluationDecoration
		explanation.valeur = valeur
	}
	const evaluation = {
		...node,
		explanation,
		nodeValue: valeur && 'nodeValue' in valeur ? valeur.nodeValue : false,
		missingVariables: mergeMissing(valeur?.missingVariables, bonus(parent?.missingVariables)),
		...(valeur && 'unit' in valeur && { unit: valeur.unit }),
	}

	this.cache[node.dottedName] = evaluation;
	return evaluation;
})

