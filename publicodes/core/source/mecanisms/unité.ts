import { ASTNode, Unit } from '../AST/types'
import { warning } from '../error'
import { registerEvaluationFunction } from '../evaluationFunctions'
import parse from '../parse'
import { convertUnit, parseUnit } from '../units'

export type UnitéNode = {
	parsedUnit: Unit
	explanation: ASTNode
	nodeKind: 'unité'
}

export default function parseUnité(v, context): UnitéNode {
	const explanation = parse(v.valeur, context)
	const parsedUnit = parseUnit(v.unité, context.getUnitKey)

	return {
		explanation,
		parsedUnit,
		nodeKind: parseUnité.nom,
	}
}

parseUnité.nom = 'unité' as const

registerEvaluationFunction(parseUnité.nom, function evaluate(node) {
	const valeur = this.evaluate(node.explanation)

	let nodeValue = valeur.nodeValue
	if (nodeValue !== false) {
		try {
			nodeValue = convertUnit(
				valeur.unit,
				node.parsedUnit,
				valeur.nodeValue as number
			)
		} catch (e) {
			warning(
				this.options.logger,
				this.cache._meta.evaluationRuleStack[0],
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
