import { ASTNode, Unit } from '../AST/types'
import { typeWarning } from '../error'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { convertUnit, parseUnit } from '../units'

export type UnitéNode = {
	unit: Unit
	explanation: ASTNode
	nodeKind: 'unité'
}

export default function parseUnité(v, context): UnitéNode {
	const explanation = parse(v.valeur, context)
	const unit = parseUnit(v.unité)

	return {
		explanation,
		unit,
		nodeKind: parseUnité.nom,
	}
}

parseUnité.nom = 'unité' as const

registerEvaluationFunction(parseUnité.nom, function evaluate(node) {
	const valeur = this.evaluate(node.explanation)

	let nodeValue = valeur.nodeValue
	if (nodeValue !== false && 'unit' in node) {
		try {
			nodeValue = convertUnit(
				valeur.unit,
				node.unit,
				valeur.nodeValue as number
			)
		} catch (e) {
			typeWarning(
				this.cache._meta.contextRule,
				"Erreur lors de la conversion d'unité explicite",
				e
			)
		}
	}

	return {
		...node,
		nodeValue,
		explanation: valeur,
		missingVariables: valeur.missingVariables,
	}
})
