import { typeWarning } from '../error'
import { defaultNode, evaluateObject, parseObject } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import { serializeUnit } from '../units'
import { ASTNode } from '../AST/types'

export type ReductionNode = {
	explanation: {
		assiette: ASTNode
		abattement: ASTNode
		plafond: ASTNode
	}
	nodeKind: 'allègement'
}

const objectShape = {
	assiette: false,
	abattement: defaultNode(0),
	plafond: defaultNode(Infinity),
}

const evaluate = evaluateObject<'allègement'>(function ({
	assiette,
	abattement,
	plafond,
}) {
	const assietteValue = assiette.nodeValue
	if (assietteValue == null) return { nodeValue: null }
	if (assiette.unit) {
		try {
			plafond = convertNodeToUnit(assiette.unit, plafond)
			if (serializeUnit(abattement.unit) !== '%') {
				abattement = convertNodeToUnit(assiette.unit, abattement)
			}
		} catch (e) {
			typeWarning(
				this.cache._meta.contextRule,
				"Impossible de convertir les unités de l'allègement entre elles",
				e
			)
		}
	}
	const nodeValue = abattement
		? abattement.nodeValue == null
			? assietteValue === 0
				? 0
				: null
			: serializeUnit(abattement.unit) === '%'
			? Math.max(
					0,
					assietteValue -
						Math.min(
							plafond.nodeValue,
							(abattement.nodeValue / 100) * assietteValue
						)
			  )
			: Math.max(
					0,
					assietteValue - Math.min(plafond.nodeValue, abattement.nodeValue)
			  )
		: assietteValue
	return {
		nodeValue,
		...('unit' in assiette && { unit: assiette.unit }),
		explanation: {
			plafond,
			abattement,
		},
	}
})

export const mecanismReduction = (v, context) => {
	const explanation = parseObject(objectShape, v, context)

	return {
		explanation,
		nodeKind: 'allègement',
	} as ReductionNode
}

registerEvaluationFunction('allègement', evaluate)
