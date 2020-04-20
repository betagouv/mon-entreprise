/**
 * Note: all here is strictly based on duck typing.
 * We don't exepect the parent rule to explain the type of the contained formula, for example.
 */

import { chain, partial } from 'ramda'
import { ParsedRules } from './types'

// type GraphNode = {
//   name: string
//   children?: Array<GraphNode>
// }
type DottedName = string

type ASTNode = any

type RuleNode = any // extends ASTNode

type Value = any // extends ASTNode

type Operation = any // extends ASTNode

type Reference = ASTNode & {
	category: 'reference'
	dottedName: DottedName
}

type Possibilities = any // extends ASTNode

type Recalcul = ASTNode & {
	règle: DottedName
} // [XXX] - faire la meme pour les autres

type Mechanism = any // extends ASTNode

type FormuleNode = Value | Operation | Possibilities | Recalcul | Mechanism

type EncadrementMech = any // extends Mechanism

type SommeMech = any // extends Mechanism

export function isValue(node): node is Value {
	return (node as Value).nodeValue !== undefined
}

export function isOperation(node): node is Operation {
	return (node as Operation).operationType !== undefined
}

export function isReference(node): node is Reference {
	return (node as Reference).category === 'reference'
}

export function isPossibilities(node): node is Possibilities {
	return (node as Possibilities).possibilités !== undefined
}

export function isRecalcul(node): node is Recalcul {
	return (node as Recalcul).règle !== undefined // [XXX] - A VERIF
}

export function isMechanism(node): node is Mechanism {
	return (node as Mechanism).category === 'mecanism'
}

export function isFormuleNode(node): node is FormuleNode {
	return (
		isValue(node as Value) ||
		isOperation(node as Operation) ||
		isReference(node as Reference) ||
		isPossibilities(node as Possibilities) ||
		isRecalcul(node as Recalcul) ||
		isMechanism(node as Mechanism)
	)
}

export function isEncadrementMech(
	mechanism: Mechanism
): mechanism is EncadrementMech {
	return (mechanism as EncadrementMech).explanation.name === 'encadrement'
}

export function isSommeMech(mechanism: Mechanism): mechanism is SommeMech {
	return (mechanism as EncadrementMech).explanation.name === 'somme'
}

function logVisit(depth: number, typeName: string, repr: string): void {
	console.log(' '.repeat(depth) + `visiting ${typeName} node ${repr}`)
}

export function ruleDependenciesOfNode(
	depth: number,
	node: ASTNode
): Array<DottedName> {
	function ruleDependenciesOfValue(
		depth: number,
		value: Value
	): Array<DottedName> {
		logVisit(depth, 'value', value.nodeValue)
		return []
	}

	function ruleDependenciesOfOperation(
		depth: number,
		operation: Operation
	): Array<DottedName> {
		logVisit(depth, 'operation', operation.operationType)
		return chain(partial(ruleDependenciesOfNode, [depth + 1]))(
			operation.explanation
		)
	}

	function ruleDependenciesOfReference(
		depth: number,
		reference: Reference
	): Array<DottedName> {
		logVisit(depth, 'reference', reference.dottedName)
		return [reference.dottedName]
	}

	function ruleDependenciesOfPossibilities(
		depth: number,
		possibilities: Possibilities
	): Array<DottedName> {
		logVisit(depth, 'possibilities', possibilities.possibilités)
		return []
	}

	function ruleDependenciesOfRecalcul(
		depth: number,
		recalcul: Recalcul
	): Array<DottedName> {
		logVisit(depth, 'recalcul', recalcul.règle)
		return [recalcul.règle]
	}

	function ruleDependenciesOfMechanism(
		depth: number,
		mechanism: Mechanism
	): Array<DottedName> {
		logVisit(depth, 'mechanism', mechanism.name)
		// [XXX] - flatten this out in the main function, like the other types
		if (isEncadrementMech(mechanism)) {
			chain(partial(ruleDependenciesOfNode, [depth + 1]))(
				mechanism.valeur.explanation
			)
		}
		if (isSommeMech(mechanism)) {
			chain(partial(ruleDependenciesOfNode, [depth + 1]))(mechanism.explanation)
		}
		return [] // [XXX]
	}

	if (isValue(node)) {
		return ruleDependenciesOfValue(depth, node as Value)
	} else if (isOperation(node)) {
		return ruleDependenciesOfOperation(depth, node as Operation)
	} else if (isReference(node)) {
		return ruleDependenciesOfReference(depth, node as Reference)
	} else if (isPossibilities(node)) {
		return ruleDependenciesOfPossibilities(depth, node as Possibilities)
	} else if (isRecalcul(node)) {
		return ruleDependenciesOfRecalcul(depth, node as Recalcul)
	} else if (isMechanism(node)) {
		return ruleDependenciesOfMechanism(depth, node as Mechanism)
	}
	debugger
	return [] // [XXX]
}

function ruleDependenciesOfRule(
	depth: number,
	rule: RuleNode
): Array<DottedName> {
	logVisit(depth, 'rule', rule.dottedName)
	if (rule.formule) {
		const formuleNode: FormuleNode = rule.formule.explanation
		// This is for comfort, as the responsibility over structure isn't owned by this piece of code:
		if (!isFormuleNode(formuleNode)) {
			debugger
			throw Error(
				`This rule's formule is not of a known type: ${rule.dottedName}`
			)
		}
		return ruleDependenciesOfNode(depth + 1, formuleNode)
	} else return [rule.dottedName]
}

export function buildRulesDependencies(
	parsedRules: ParsedRules<DottedName>
): Record<DottedName, Array<DottedName>> {
	return Object.fromEntries(
		Object.entries(parsedRules).map(([dottedName, parsedRule]) => [
			dottedName,
			ruleDependenciesOfRule(0, parsedRule)
		])
	)
}
