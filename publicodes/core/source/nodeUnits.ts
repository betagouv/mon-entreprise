import { ASTNode, EvaluatedNode, Unit } from './AST/types'
import { registerEvaluationFunction } from './evaluationFunctions'
import {
	conversionFactor,
	convertUnit,
	inferUnit,
	serializeUnit,
	simplifyUnit,
} from './units'

export function simplifyNodeUnit(node) {
	if (!node.unit) {
		return node
	}
	const unit = simplifyUnit(node.unit)

	return convertNodeToUnit(unit, node)
}

// TODO: to remove (runtime conversion)
export function convertNodeToUnit<Node extends EvaluatedNode = EvaluatedNode>(
	to: Unit | undefined,
	node: Node
): Node {
	return {
		...node,
		nodeValue:
			node.unit && typeof node.nodeValue === 'number'
				? convertUnit(node.unit, to, node.nodeValue)
				: node.nodeValue,
		unit: to,
	}
}

export const inferNodeUnit = (parsedRules, stack) => {
	const unimplementedMecanisms = new Set()
	const rec = (node: ASTNode) => {
		if (node.unit) {
			return node
		}
		switch (node.nodeKind) {
			case 'rule': {
				if (stack.includes(node.dottedName)) {
					console.log('cycle', stack)
					stack.shift()
					return node
				}
				stack.unshift(node.dottedName)
				const valeur = rec(node.explanation.valeur)
				parsedRules[node.dottedName] = {
					...node,
					explanation: { ...node.explanation, valeur },
					unit: valeur.unit,
				}
				stack.shift()
				return parsedRules[node.dottedName]
			}

			case 'toutes ces conditions':
			case 'constant':
				return node

			case 'arrondi':
			case 'applicable si':
			case 'non applicable si':
			case 'nom dans la situation': {
				const valeur = rec(node.explanation.valeur)
				return {
					...node,
					explanation: { ...node.explanation, valeur },
					unit: valeur.unit,
				}
			}
			case 'par défaut': {
				const unit =
					rec(node.explanation.valeur).unit ??
					rec(node.explanation.parDéfaut).unit
				return { ...node, unit }
			}

			case 'somme':
			case 'maximum':
			case 'minimum': {
				const explanation = staticListOfSameUnit(
					node.explanation.map((n) => rec(n))
				)
				return { ...node, explanation, unit: explanation[0].unit }
			}

			case 'produit': {
				const assiette =
					node.explanation.assiette && rec(node.explanation.assiette)
				const facteur =
					node.explanation.facteur && rec(node.explanation.facteur)
				const taux = node.explanation.taux && rec(node.explanation.taux)
				const plafond =
					node.explanation.plafond && rec(node.explanation.plafond)
				const unit = inferUnit(
					'*',
					[assiette, taux, facteur].map((el) => el.unit)
				)

				return { ...node, explanation: { assiette, facteur, taux }, unit }
			}

			case 'barème':
				return { ...node, unit: rec(node.explanation.assiette).unit }

			case 'plancher':
			case 'plafond':
				return {
					...node,
					unit: rec(node.explanation.valeur).unit,
				}

			case 'operation':
				if (node.operationKind === '+' || node.operationKind === '-') {
					const node1 = rec(node.explanation[0])
					const node2 = staticConvertNodeToUnit(
						rec(node.explanation[1]),
						node1.unit
					)
					return { ...node, explanation: [node1, node2], unit: node1.unit }
				} else if (node.operationKind === '*' || node.operationKind === '/') {
					const node1 = rec(node.explanation[0])
					const node2 = rec(node.explanation[1])
					return {
						...node,
						explanation: [node1, node2],
						unit: inferUnit(node.operationKind, [node1.unit, node2.unit]),
					}
				} else {
					return node
				}

			case 'variations': {
				const explanation = staticListOfSameUnit(
					node.explanation.map(({ consequence }) => rec(consequence))
				).map((consequence, i) => ({ ...node.explanation[i], consequence }))
				return {
					...node,
					explanation,
					unit: explanation[explanation.length - 1].consequence.unit,
				}
			}

			case 'abattement': {
				const assiette = rec(node.explanation.assiette)
				let abattement = rec(node.explanation.abattement)
				const percentageAbattement = serializeUnit(abattement.unit) === '%'
				if (!percentageAbattement) {
					abattement = staticConvertNodeToUnit(abattement, assiette.unit)
				}
				return {
					...node,
					explanation: { assiette, abattement },
					unit: assiette.unit,
				}
			}

			case 'unité':
				return staticConvertNodeToUnit(rec(node.explanation), node.parsedUnit)

			case 'reference':
				if (node.dottedName) {
					return { ...node, unit: rec(parsedRules[node.dottedName]).unit }
				} else {
					return node
				}
		}
		unimplementedMecanisms.add(node.nodeKind)
		return node
	}
	// console.log(unimplementedMecanisms)
	return rec
}

export function staticListOfSameUnit(nodes: Array<ASTNode>) {
	return nodes.map((node, i) =>
		i === 0 ? node : staticConvertNodeToUnit(node, nodes[0].unit!)
	)
}

export type UnitConversionNode = {
	nodeKind: 'unit-conversion'
	factor: number
	unit: Unit
	explanation: ASTNode
}

export function staticConvertNodeToUnit(node: ASTNode, unit: Unit) {
	let factor
	try {
		if (node.unit) {
			factor = conversionFactor(node.unit, unit)
		}
	} catch {
		// console.log('error')
		return { ...node, unit }
	}
	if (factor === 1) {
		return { ...node, unit }
	}
	return {
		nodeKind: 'unit-conversion',
		factor,
		unit,
		explanation: node,
	}
}

registerEvaluationFunction('unit-conversion', function evaluate(node) {
	const evaluatedNode = this.evaluate(node.explanation)
	const nodeValue =
		typeof evaluatedNode.nodeValue === 'number'
			? node.factor * evaluatedNode.nodeValue
			: evaluatedNode.nodeValue
	return {
		...evaluatedNode,
		nodeValue,
	} as any
})
