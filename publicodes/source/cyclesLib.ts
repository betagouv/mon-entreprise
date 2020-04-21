/**
 * Note: all here is strictly based on duck typing.
 * We don't exepect the parent rule to explain the type of the contained formula, for example.
 */

import R from 'ramda'
import { ParsedRule, ParsedRules } from './types'

// type GraphNode = {
//   name: string
//   children?: Array<GraphNode>
// }

type ASTNode = { [index: string]: {} | undefined }

// [XXX] - Vaudrait-il mieux utiliser les DottedNames directement ici?
// A priori non car on peut imaginer cette lib comme étant indépendante des règles existantes et
// fonctionnant par ex en "mode serveur".
type RuleNode<Name extends string> = /* ASTNode & */ ParsedRule<Name>

type Value = ASTNode & {
	nodeValue: any
	constant: true
}
export function isValue(node: ASTNode): node is Value {
	return (
		(node as Value).nodeValue !== undefined && (node as Value).constant === true
	)
}

type Operation = ASTNode & {
	operationType: 'comparison' | 'calculation'
	explanation: Array<ASTNode>
}
export function isOperation(node: ASTNode): node is Operation {
	return (
		(node as Operation).operationType === 'comparison' ||
		(node as Operation).operationType === 'calculation'
	)
	// return R.includes((node as Operation).operationType, [
	// 	'comparison',
	// 	'calculation'
	// ])
}

type Possibilities = ASTNode & {
	possibilités: Array<string>
	'choix obligatoire'?: 'oui' | 'non' // [XXX] - This should already be a defined type.
	'une possibilité': 'oui' | 'non'
}
export function isPossibilities(node: ASTNode): node is Possibilities {
	const possibilities = node as Possibilities
	return (
		possibilities.possibilités instanceof Array &&
		possibilities.possibilités.every(it => typeof it === 'string') &&
		(possibilities['choix obligatoire'] === undefined ||
			possibilities['choix obligatoire'] === 'oui' ||
			possibilities['choix obligatoire'] === 'non') &&
		(possibilities['une possibilité'] === 'oui' ||
			possibilities['une possibilité'] === 'non')
		// R.includes(possibilities['choix obligatoire'], [undefined, 'oui', 'non']) &&
		// R.includes(possibilities['une possibilité'], ['oui', 'non'])
	)
}

type Reference<Name extends string> = Omit<RuleNode<Name>, 'category'> & {
	// [XXX] - a priori non pour le omit, il n'y a pas du tout autant de choses que dans RuleNode à l'intérieur d'une reference
	category: 'reference'
	partialReference: Name
	dottedName: Name
}
export function isReference<Name extends string>(
	node: ASTNode
): node is Reference<Name> {
	return (
		(node as Reference<Name>).category === 'reference' &&
		(node as Reference<Name>).partialReference !== undefined &&
		(node as Reference<Name>).dottedName !== undefined
	)
}

type Recalcul<Name extends string> = ASTNode & {
	explanation: {
		recalcul: Reference<Name>
		amendedSituation: Record<Name, Reference<Name>>
	}
}
export function isRecalcul<Name extends string>(
	node: ASTNode
): node is Recalcul<Name> {
	const recalcul = node as Recalcul<Name>
	return (
		typeof recalcul.explanation === 'object' &&
		typeof recalcul.explanation.recalcul === 'object' &&
		isReference(recalcul.explanation.recalcul as ASTNode) &&
		typeof recalcul.explanation.amendedSituation === 'object' &&
		R.values(recalcul.explanation.amendedSituation).every(v => v !== undefined) // [XXX] - maybe a bit useless
	)
}

type Mechanism = ASTNode & {
	category: 'mecanism'
}
export function isMechanism(node: ASTNode): node is Mechanism {
	return (node as Mechanism).category === 'mecanism'
}

type FormuleNode<Name> =
	| Value
	| Operation
	| Possibilities
	| Reference<Name>
	| Recalcul<Name>
	| Mechanism
export function isFormuleNode<Name extends string>(
	node: ASTNode
): node is FormuleNode<Name> {
	return (
		isValue(node) ||
		isOperation(node) ||
		isReference(node) ||
		isPossibilities(node) ||
		isRecalcul(node) ||
		isMechanism(node)
	)
}

type EncadrementMech = Mechanism & {
	valeur: {
		explanation: ASTNode
		[s: string]: {}
	}
}
export function isEncadrementMech(
	mechanism: Mechanism
): mechanism is EncadrementMech {
	return (mechanism as EncadrementMech).explanation.name === 'encadrement'
}

type SommeMech = any // extends Mechanism
export function isSommeMech(mechanism: Mechanism): mechanism is SommeMech {
	return (mechanism as EncadrementMech).explanation.name === 'somme'
}

function logVisit(depth: number, typeName: string, repr: string): void {
	console.log(' '.repeat(depth) + `visiting ${typeName} node ${repr}`)
}

export function ruleDependenciesOfNode<Name extends string>(
	depth: number,
	node: ASTNode
): Array<Name> {
	function ruleDependenciesOfValue(depth: number, value: Value): Array<Name> {
		logVisit(depth, 'value', value.nodeValue)
		return []
	}

	function ruleDependenciesOfOperation(
		depth: number,
		operation: Operation
	): Array<Name> {
		logVisit(depth, 'operation', operation.operationType)
		return R.chain<ASTNode, Name>(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			])
		)(operation.explanation)
	}

	function ruleDependenciesOfPossibilities(
		depth: number,
		possibilities: Possibilities
	): Array<Name> {
		logVisit(depth, 'possibilities', possibilities.possibilités.join(', '))
		return []
	}

	function ruleDependenciesOfReference(
		depth: number,
		reference: Reference<Name>
	): Array<Name> {
		logVisit(depth, 'reference', reference.dottedName)
		return [reference.dottedName]
	}

	function ruleDependenciesOfRecalcul(
		depth: number,
		recalcul: Recalcul<Name>
	): Array<Name> {
		logVisit(
			depth,
			'recalcul',
			recalcul.explanation.recalcul.partialReference as string
		)
		return [recalcul.explanation.recalcul.partialReference]
	}

	function ruleDependenciesOfMechanism(
		depth: number,
		mechanism: Mechanism
	): Array<Name> {
		logVisit(depth, 'mechanism', '')
		debugger
		// [XXX] - flatten this out in the main function, like the other types
		// if (isEncadrementMech(mechanism)) {
		// 	chain(partial(ruleDependenciesOfNode, [depth + 1]))(
		// 		mechanism.valeur.explanation
		// 	)
		// }
		// if (isSommeMech(mechanism)) {
		// 	chain(partial(ruleDependenciesOfNode, [depth + 1]))(mechanism.explanation)
		// }
		return [] // [XXX]
	}

	if (isValue(node)) {
		return ruleDependenciesOfValue(depth, node as Value)
	} else if (isOperation(node)) {
		return ruleDependenciesOfOperation(depth, node as Operation)
	} else if (isReference(node)) {
		return ruleDependenciesOfReference(depth, node as Reference<Name>)
	} else if (isPossibilities(node)) {
		return ruleDependenciesOfPossibilities(depth, node as Possibilities)
	} else if (isRecalcul(node)) {
		return ruleDependenciesOfRecalcul(depth, node as Recalcul<Name>)
	} else if (isMechanism(node)) {
		return ruleDependenciesOfMechanism(depth, node as Mechanism)
	}
	return [] // [XXX]
}

function ruleDependenciesOfRule<Name extends string>(
	depth: number,
	rule: RuleNode<Name>
): Array<Name> {
	logVisit(depth, 'rule', rule.dottedName as string)
	if (rule.formule) {
		const formuleNode: FormuleNode<Name> = rule.formule.explanation
		// This is for comfort, as the responsibility over structure isn't owned by this piece of code:
		if (!isFormuleNode(formuleNode)) {
			debugger
			// throw Error(
			// 	`This rule's formule is not of a known type: ${rule.dottedName}`
			// )
		}
		return ruleDependenciesOfNode(depth + 1, formuleNode)
	} else return [rule.dottedName]
}

export function buildRulesDependencies<Name extends string>(
	parsedRules: ParsedRules<Name>
): Array<[Name, Array<Name>]> {
	// This stringPairs thing is necessary because `toPairs` is strictly considering that
	// object keys are strings (same for `Object.entries`). Maybe we should build our own
	// `toPairs`?
	const stringPairs: Array<[string, RuleNode<Name>]> = R.toPairs(parsedRules)
	const pairs: Array<[Name, RuleNode<Name>]> = stringPairs as Array<
		[Name, RuleNode<Name>]
	>
	const pairsResults: Array<Array<Name>> = R.map(
		([_, ruleNode]: [Name, RuleNode<Name>]): Array<Name> =>
			ruleDependenciesOfRule<Name>(0, ruleNode),
		pairs
	)
	console.log(pairsResults)

	return R.map(
		([dottedName, ruleNode]: [Name, RuleNode<Name>]): [Name, Array<Name>] => [
			dottedName,
			ruleDependenciesOfRule<Name>(0, ruleNode)
		],
		pairs
	)
}
