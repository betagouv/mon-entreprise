import { EvaluationFunction, serializeUnit } from '..'
import { ASTNode } from '../AST/types'
import { mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
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
	const abattement = this.evaluate(node.explanation.abattement)

	const assietteValue = assiette.nodeValue as number | null
	const abattementValue = abattement.nodeValue as number | null
	const percentageAbattement = serializeUnit(abattement.unit) === '%'
	const nodeValue = abattementValue
		? assietteValue == null
			? null
			: abattementValue == null
			? assietteValue == 0
				? 0
				: null
			: percentageAbattement
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
	const assiette = parse(v.valeur, context)
	const abattement = parse(v.abattement, context)

	return {
		explanation: { assiette, abattement },
		nodeKind: parseAbattement.nom,
	}
}

parseAbattement.nom = 'abattement' as const

registerEvaluationFunction(parseAbattement.nom, evaluateAbattement)
