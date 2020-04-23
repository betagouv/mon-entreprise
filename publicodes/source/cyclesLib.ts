/**
 * Note: all here is strictly based on duck typing.
 * We don't exepect the parent rule to explain the type of the contained formula, for example.
 */

import R from 'ramda'
import { ParsedRule, ParsedRules } from './types'

type OnOff = 'oui' | 'non'
export function isOnOff(a: string): a is OnOff {
	return a === 'oui' || a === 'non'
}

type WannabeDottedName = string
export function isWannabeDottedName(a: string): a is WannabeDottedName {
	return typeof a === 'string'
}

type ASTNode = { [_: string]: {} | undefined }

// [XXX] - Vaudrait-il mieux utiliser les DottedNames directement ici?
// A priori non car on peut imaginer cette lib comme étant indépendante des règles existantes et
// fonctionnant par ex en "mode serveur".
type RuleNode<Name extends string> = /* ASTNode & */ ParsedRule<Name>

type Value = ASTNode & {
	nodeValue: number | string
	constant?: boolean
}
export function isValue(node: ASTNode): node is Value {
	const value = node as Value
	return (
		(typeof value.nodeValue === 'string' ||
			typeof value.nodeValue === 'number') &&
		(value.constant === undefined || typeof value.constant === 'boolean')
	)
}

type Operation = ASTNode & {
	operationType: 'comparison' | 'calculation'
	explanation: Array<ASTNode>
}
export function isOperation(node: ASTNode): node is Operation {
	return R.includes((node as Operation).operationType, [
		'comparison',
		'calculation'
	])
}

type Possibilities = ASTNode & {
	possibilités: Array<string>
	'choix obligatoire'?: OnOff
	'une possibilité': OnOff
}
export function isPossibilities(node: ASTNode): node is Possibilities {
	const possibilities = node as Possibilities
	return (
		possibilities.possibilités instanceof Array &&
		possibilities.possibilités.every(it => typeof it === 'string') &&
		(possibilities['choix obligatoire'] === undefined ||
			isOnOff(possibilities['choix obligatoire'])) &&
		isOnOff(possibilities['une possibilité'])
	)
}

type Reference<Name extends string> = ASTNode & {
	category: 'reference'
	name: Name
	partialReference: Name
	dottedName: Name
	unit: {} | undefined
}
export function isReference<Name extends string>(
	node: ASTNode
): node is Reference<Name> {
	const reference = node as Reference<Name>
	return (
		reference.category === 'reference' &&
		isWannabeDottedName(reference.name) &&
		isWannabeDottedName(reference.partialReference) &&
		isWannabeDottedName(reference.dottedName)
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
		typeof recalcul.explanation.amendedSituation === 'object'
		// [XXX] - We would like to do
		// && R.all(isDottedName, R.keys(recalcul.explanation.amendedSituation))
		// but it seems there is no simple way to get a type's guard in Typescript
		// apart if it's built as a class. Or we could rebuild everything here with
		// passing this guard ƒ as a context everywhere along with the ASTNodes,
		// with a context monad for example. Overkill.
	)
}

type AbstractMechanism = ASTNode & {
	category: 'mecanism'
	name: string
}
export function isAbstractMechanism(node: ASTNode): node is AbstractMechanism {
	return (
		(node as AbstractMechanism).category === 'mecanism' &&
		typeof (node as AbstractMechanism).name === 'string'
	)
}

type EncadrementMech = AbstractMechanism & {
	name: 'encadrement'
	valeur: {
		explanation: Array<ASTNode>
		[_: string]: {} | undefined
	}
}
export function isEncadrementMech(node: ASTNode): node is EncadrementMech {
	const encadrementMech = node as EncadrementMech
	return (
		isAbstractMechanism(encadrementMech) &&
		typeof encadrementMech.valeur === 'object' &&
		encadrementMech.valeur.explanation instanceof Array &&
		encadrementMech.name === 'encadrement'
	)
}

type SommeMech = AbstractMechanism & {
	name: 'somme'
	explanation: Array<ASTNode>
}
export function isSommeMech(node: ASTNode): node is SommeMech {
	const sommeMech = node as SommeMech
	return (
		isAbstractMechanism(sommeMech) &&
		sommeMech.name === 'somme' &&
		typeof sommeMech.explanation === 'object'
	)
}

type ProduitMech = AbstractMechanism & {
	name: 'produit'
	type: 'numeric'
	unit: {}
	explanation: {
		assiette: ASTNode
		plafond: ASTNode
		facteur: ASTNode
		taux: ASTNode
	}
}
export function isProduitMech(node: ASTNode): node is ProduitMech {
	const produitMech = node as ProduitMech
	return (
		produitMech.name === 'produit' &&
		produitMech.type === 'numeric' &&
		produitMech.unit !== undefined &&
		typeof produitMech.explanation === 'object' &&
		typeof produitMech.explanation.assiette === 'object' &&
		typeof produitMech.explanation.plafond === 'object' &&
		typeof produitMech.explanation.facteur === 'object' &&
		typeof produitMech.explanation.taux === 'object'
	)
}

type AnyMechanism = EncadrementMech | SommeMech
export function isAnyMechanism(node: ASTNode): node is AnyMechanism {
	return isEncadrementMech(node) || isSommeMech(node) || isProduitMech(node)
}

type FormuleNode<Name extends string> =
	| Value
	| Operation
	| Possibilities
	| Reference<Name>
	| Recalcul<Name>
	| AnyMechanism
export function isFormuleNode<Name extends string>(
	node: ASTNode
): node is FormuleNode<Name> {
	return (
		isValue(node) ||
		isOperation(node) ||
		isReference(node) ||
		isPossibilities(node) ||
		isRecalcul(node) ||
		isAnyMechanism(node)
	)
}

function logVisit(
	depth: number,
	typeName: string,
	obj: string | number | object
): void {
	let cleanRepr = obj
	if (typeof obj === 'object') {
		cleanRepr = JSON.stringify(obj, null)
	}
	console.log(' '.repeat(depth) + `visiting ${typeName} node ${cleanRepr}`)
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
		return R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			operation.explanation
		)
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

	function ruleDependenciesOfEncadrementMech(
		depth: number,
		encadrementMech: EncadrementMech
	): Array<Name> {
		debugger // [XXX] - correct the type, guard and visit logger
		logVisit(depth, 'encadrement mechanism', '??') // [XXX]
		return R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			encadrementMech.valeur.explanation
		)
	}

	function ruleDependenciesOfSommeMech(
		depth: number,
		sommeMech: SommeMech
	): Array<Name> {
		debugger // [XXX] - correct the type, guard and visit logger
		logVisit(depth, 'somme mech', '??') // [XXX]
		return R.chain(
			R.partial<number, ASTNode, Array<Name>>(ruleDependenciesOfNode, [
				depth + 1
			]),
			sommeMech.explanation
		)
	}

	function ruleDependenciesOfProduitMech(
		depth: number,
		produitMech: ProduitMech
	): Array<Name> {
		logVisit(depth, 'produit mech', '')
		const result = R.chain<Array<Name>, Name>(R.identity, [
			ruleDependenciesOfNode(depth + 1, produitMech.explanation.assiette),
			ruleDependenciesOfNode(depth + 1, produitMech.explanation.plafond),
			ruleDependenciesOfNode(depth + 1, produitMech.explanation.facteur),
			ruleDependenciesOfNode(depth + 1, produitMech.explanation.taux)
		])
		return result
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
	} else if (isEncadrementMech(node)) {
		return ruleDependenciesOfEncadrementMech(depth, node as EncadrementMech)
	} else if (isSommeMech(node)) {
		return ruleDependenciesOfSommeMech(depth, node as SommeMech)
	} else if (isProduitMech(node)) {
		return ruleDependenciesOfProduitMech(depth, node)
	}
	throw new Error(
		`This node doesn't have a visitor method defined: ${JSON.stringify(
			node,
			null,
			4
		)}`
	)
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
