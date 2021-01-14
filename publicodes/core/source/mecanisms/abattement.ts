import { EvaluationFunction, serializeUnit } from '..'
import { ASTNode } from '../AST/types'
import { warning } from '../error'
import { mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'
import { Context } from '../parsePublicodes'

export type AbattementNode = {
	explanation: {
		assiette: ASTNode
		abattement: ASTNode
	}
	nodeKind: 'abattement'
}

const evaluateAbattement: EvaluationFunction<'abattement'> = function (node) {
	const assiette = this.evaluate(node.explanation.assiette)
	let abattement = this.evaluate(node.explanation.abattement)
	const percentageAbattement = serializeUnit(abattement.unit) === '%'
	if (assiette.unit && !percentageAbattement) {
		try {
			abattement = convertNodeToUnit(assiette.unit, abattement)
		} catch (e) {
			warning(
				this.options.logger,
				this.cache._meta.ruleStack[0],
				"Impossible de convertir les unités de l'allègement entre elles",
				e
			)
		}
	}

	const assietteValue = assiette.nodeValue as number | null
	const abattementValue = abattement.nodeValue as number | null
	const nodeValue = abattementValue
		? assietteValue == null
			? null
			: abattementValue == null
			? assietteValue == 0
				? 0
				: null
			: serializeUnit(abattement.unit) === '%'
			? Math.max(0, assietteValue - (abattementValue / 100) * assietteValue)
			: Math.max(0, assietteValue - abattementValue)
		: assietteValue

	return {
		...node,
		nodeValue,
		unit: assiette.unit,
		missingVariables: mergeAllMissing([assiette, abattement]),
		explanation: {
			assiette,
			abattement,
		},
	}
}

export default function parseAbattement(v, context: Context) {
	const explanation = {
		assiette: parse(v.valeur, context),
		abattement: parse(v.abattement, context),
	}
	return {
		explanation,
		nodeKind: parseAbattement.nom,
	}
}

parseAbattement.nom = 'abattement' as const

registerEvaluationFunction(parseAbattement.nom, evaluateAbattement)
