import { InternalError } from '../error'
import { TrancheNodes } from '../mecanisms/trancheUtils'
import { ReplacementRule } from '../replacement'
import { RuleNode } from '../rule'
import { ASTNode, NodeKind, TraverseFunction } from './types'

type TransformASTFunction = (n: ASTNode) => ASTNode
/**
	This function creates a transormation of the AST from on a simpler
	callback function `fn`

	`fn` will be called with the nodes of the ASTTree during the exploration

	The outcome of the callback function has an influence on the exploration of the AST :
	- `false`, the node is not updated and the exploration does not continue further down this branch
	- `undefined`, the node is not updated but the exploration continues and its children will be transformed
	- `ASTNode`, the node is transformed to the new value and the exploration does not continue further down the branch

	`updateFn` : It is possible to specifically use the updated version of a child
	by using the function passed as second argument. The returned value will be the
	transformed version of the node.
	*/
export function transformAST(
	fn: (
		node: ASTNode,
		updateFn: TransformASTFunction
	) => ASTNode | undefined | false
): TransformASTFunction {
	function traverseFn(node: ASTNode) {
		const updatedNode = fn(node, traverseFn)
		if (updatedNode === false) {
			return node
		}
		if (updatedNode === undefined) {
			return traverseASTNode(traverseFn, node)
		}
		return updatedNode
	}
	return traverseFn
}

/**
		This function allows to construct a specific value while exploring the AST with
		a simple reducing function as argument.

		`fn` will be called with the currently reduced value `acc` and the current node of the AST


		The outcome of the callback function has an influence on the exploration of the AST :
		- `undefined`, the exploration continues further down and all the child are reduced
			successively to a single value
		- `T`, the reduced value

		`reduceFn` : It is possible to specifically use the reduced value of a child
		by using the function passed as second argument. The returned value will be the reduced version
		of the node
		*/

export function reduceAST<T>(
	fn: (acc: T, n: ASTNode, reduceFn: (n: ASTNode) => T) => T | undefined,
	start: T,
	node: ASTNode
): T {
	function traverseFn(acc: T, node: ASTNode): T {
		const result = fn(acc, node, traverseFn.bind(null, start))
		if (result === undefined) {
			return gatherNodes(node).reduce(traverseFn, acc)
		}
		return result
	}
	return traverseFn(start, node)
}

function gatherNodes(node: ASTNode): ASTNode[] {
	const nodes: ASTNode[] = []
	traverseASTNode((node) => {
		nodes.push(node)
		return node
	}, node)
	return nodes
}

export function traverseParsedRules(
	fn: (n: ASTNode) => ASTNode,
	parsedRules: Record<string, RuleNode>
): Record<string, RuleNode> {
	return Object.fromEntries(
		Object.entries(parsedRules).map(([name, rule]) => [name, fn(rule)])
	) as Record<string, RuleNode>
}

const traverseASTNode: TraverseFunction<NodeKind> = (fn, node) => {
	switch (node.nodeKind) {
		case 'rule':
			return traverseRuleNode(fn, node)
		case 'reference':
		case 'constant':
			return traverseLeafNode(fn, node)
		case 'applicable si':
		case 'non applicable si':
			return traverseApplicableNode(fn, node)
		case 'arrondi':
			return traverseArrondiNode(fn, node)
		case 'barème':
		case 'taux progressif':
		case 'grille':
			return traverseNodeWithTranches(fn, node)
		case 'somme':
		case 'une de ces conditions':
		case 'une possibilité':
		case 'toutes ces conditions':
		case 'minimum':
		case 'maximum':
			return traverseArrayNode(fn, node)
		case 'durée':
			return traverseDuréeNode(fn, node)
		case 'inversion':
			return traverseInversionNode(fn, node)
		case 'operation':
			return traverseOperationNode(fn, node)
		case 'par défaut':
			return traverseParDéfautNode(fn, node)
		case 'plancher':
			return traversePlancherNode(fn, node)
		case 'plafond':
			return traversePlafondNode(fn, node)
		case 'produit':
			return traverseProductNode(fn, node)
		case 'recalcul':
			return traverseRecalculNode(fn, node)
		case 'abattement':
			return traverseAbattementNode(fn, node)
		case 'nom dans la situation':
			return traverseSituationNode(fn, node)
		case 'synchronisation':
			return traverseSynchronisationNode(fn, node)
		case 'unité':
			return traverseUnitéNode(fn, node)
		case 'variations':
			return traverseVariationNode(fn, node)
		case 'variable temporelle':
			return traverseVariableTemporelle(fn, node)
		case 'replacementRule':
			return traverseReplacementNode(fn, node)
		default:
			throw new InternalError(node)
	}
}

const traverseRuleNode: TraverseFunction<'rule'> = (fn, node) => ({
	...node,
	replacements: node.replacements.map(fn) as Array<ReplacementRule>,
	suggestions: Object.fromEntries(
		Object.entries(node.suggestions).map(([key, value]) => [key, fn(value)])
	),
	explanation: {
		parent: node.explanation.parent && fn(node.explanation.parent),
		valeur: fn(node.explanation.valeur),
	},
})

const traverseReplacementNode: TraverseFunction<'replacementRule'> = (
	fn,
	node
) =>
	({
		...node,
		definitionRule: fn(node.definitionRule),
		replacedReference: fn(node.replacedReference),
		replacementNode: fn(node.replacementNode),
		whiteListedNames: node.whiteListedNames.map(fn),
		blackListedNames: node.blackListedNames.map(fn),
	} as ReplacementRule)

const traverseLeafNode: TraverseFunction<'reference' | 'constant'> = (
	_,
	node
) => node
const traverseApplicableNode: TraverseFunction<
	'applicable si' | 'non applicable si'
> = (fn, node) => ({
	...node,
	explanation: {
		condition: fn(node.explanation.condition),
		valeur: fn(node.explanation.valeur),
	},
})

function traverseTranche(fn: (n: ASTNode) => ASTNode, tranches: TrancheNodes) {
	return tranches.map((tranche) => ({
		...tranche,
		...(tranche.plafond && { plafond: fn(tranche.plafond) }),
		...('montant' in tranche && { montant: fn(tranche.montant) }),
		...('taux' in tranche && { taux: fn(tranche.taux) }),
	}))
}
const traverseNodeWithTranches: TraverseFunction<
	'barème' | 'taux progressif' | 'grille'
> = (fn, node) => ({
	...node,
	explanation: {
		assiette: fn(node.explanation.assiette),
		multiplicateur: fn(node.explanation.multiplicateur),
		tranches: traverseTranche(fn, node.explanation.tranches),
	},
})

const traverseArrayNode: TraverseFunction<
	| 'maximum'
	| 'minimum'
	| 'somme'
	| 'toutes ces conditions'
	| 'une de ces conditions'
	| 'une possibilité'
> = (fn, node) => ({
	...node,
	explanation: node.explanation.map(fn),
})

const traverseOperationNode: TraverseFunction<'operation'> = (fn, node) => ({
	...node,
	explanation: [fn(node.explanation[0]), fn(node.explanation[1])],
})
const traverseDuréeNode: TraverseFunction<'durée'> = (fn, node) => ({
	...node,
	explanation: {
		depuis: fn(node.explanation.depuis),
		"jusqu'à": fn(node.explanation["jusqu'à"]),
	},
})

const traverseInversionNode: TraverseFunction<'inversion'> = (fn, node) => ({
	...node,
	explanation: {
		...node.explanation,
		inversionCandidates: node.explanation.inversionCandidates.map(fn) as any, // TODO
	},
})

const traverseParDéfautNode: TraverseFunction<'par défaut'> = (fn, node) => ({
	...node,
	explanation: {
		valeur: fn(node.explanation.valeur),
		parDéfaut: fn(node.explanation.parDéfaut),
	},
})

const traverseArrondiNode: TraverseFunction<'arrondi'> = (fn, node) => ({
	...node,
	explanation: {
		valeur: fn(node.explanation.valeur),
		arrondi: fn(node.explanation.arrondi),
	},
})

const traversePlancherNode: TraverseFunction<'plancher'> = (fn, node) => ({
	...node,
	explanation: {
		valeur: fn(node.explanation.valeur),
		plancher: fn(node.explanation.plancher),
	},
})

const traversePlafondNode: TraverseFunction<'plafond'> = (fn, node) => ({
	...node,
	explanation: {
		valeur: fn(node.explanation.valeur),
		plafond: fn(node.explanation.plafond),
	},
})

const traverseProductNode: TraverseFunction<'produit'> = (fn, node) => ({
	...node,
	explanation: {
		assiette: fn(node.explanation.assiette),
		taux: fn(node.explanation.taux),
		facteur: fn(node.explanation.facteur),
		plafond: fn(node.explanation.plafond),
	},
})

const traverseRecalculNode: TraverseFunction<'recalcul'> = (fn, node) => ({
	...node,
	explanation: {
		amendedSituation: node.explanation.amendedSituation.map(([name, value]) => [
			fn(name),
			fn(value),
		]) as any, //TODO
		recalcul: fn(node.explanation.recalcul),
	},
})

const traverseAbattementNode: TraverseFunction<'abattement'> = (fn, node) => ({
	...node,
	explanation: {
		assiette: fn(node.explanation.assiette),
		abattement: fn(node.explanation.abattement),
	},
})

const traverseSituationNode: TraverseFunction<'nom dans la situation'> = (
	fn,
	node
) => ({
	...node,
	explanation: {
		...node.explanation,
		...(node.explanation.situationValeur && {
			situationValeur: fn(node.explanation.situationValeur),
		}),
		valeur: fn(node.explanation.valeur),
	},
})

const traverseSynchronisationNode: TraverseFunction<'synchronisation'> = (
	fn,
	node
) => ({
	...node,
	explanation: {
		...node.explanation,
		data: fn(node.explanation.data),
	},
})

const traverseUnitéNode: TraverseFunction<'unité'> = (fn, node) => ({
	...node,
	explanation: fn(node.explanation),
})

const traverseVariationNode: TraverseFunction<'variations'> = (fn, node) => ({
	...node,
	explanation: node.explanation.map(({ condition, consequence }) => ({
		condition: fn(condition),
		consequence: fn(consequence),
	})),
})

const traverseVariableTemporelle: TraverseFunction<'variable temporelle'> = (
	fn,
	node
) => ({
	...node,
	explanation: {
		period: {
			end: node.explanation.period.end && fn(node.explanation.period.end),
			start: node.explanation.period.start && fn(node.explanation.period.start),
		},
		value: fn(node.explanation.value),
	},
})
