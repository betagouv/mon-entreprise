import { ASTNode, Unit } from '../AST/types'
import { typeWarning } from '../error'
import { makeJsx } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { convertUnit, parseUnit } from '../units'

export type UnitéNode = {
	unit: Unit
	explanation: ASTNode
	jsx: any
	nodeKind: 'unité'
}
function MecanismUnité({ explanation, nodeValue, unit }) {
	return makeJsx({ ...explanation, nodeValue, unit })
}

export default function parseUnité(v, context): UnitéNode {
	const explanation = parse(v.valeur, context)
	const unit = parseUnit(v.unité)

	return {
		jsx: MecanismUnité,
		explanation,
		unit,
		nodeKind: parseUnité.nom
	}
}

parseUnité.nom = 'unité' as const

registerEvaluationFunction(parseUnité.nom, function evaluate(node) {
	const valeur = this.evaluateNode(node.explanation)

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
				`Erreur lors de la conversion d'unité explicite`,
				e
			)
		}
	}

	return {
		...node,
		nodeValue,
		explanation: valeur,
		missingVariables: valeur.missingVariables
	}
})
