import { max, min } from 'ramda'
import Allègement from '../components/mecanisms/Allègement'
import { typeWarning } from '../error'
import { defaultNode, evaluateObject, parseObject } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import { serializeUnit } from '../units'
import parse from '../parse'
import { ASTNode } from '../AST/types'

export type ReductionNode = {
	explanation: {
		assiette: ASTNode
		abattement: ASTNode
		plafond: ASTNode
	}
	jsx: any
	nodeKind: 'allègement'
}

const objectShape = {
	assiette: false,
	abattement: defaultNode(0),
	plafond: defaultNode(Infinity)
}

const evaluate = evaluateObject<'allègement'>(function({
	assiette,
	abattement,
	plafond
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
			? max(
					0,
					assietteValue -
						min(plafond.nodeValue, (abattement.nodeValue / 100) * assietteValue)
			  )
			: max(0, assietteValue - min(plafond.nodeValue, abattement.nodeValue))
		: assietteValue
	return {
		nodeValue,
		...('unit' in assiette && { unit: assiette.unit }),
		explanation: {
			plafond,
			abattement
		}
	}
})

export const mecanismReduction = (v, context) => {
	const explanation = parseObject(objectShape, v, context)

	return {
		jsx: Allègement,
		explanation,
		nodeKind: 'allègement'
	} as ReductionNode
}

registerEvaluationFunction('allègement', evaluate)
