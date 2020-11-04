import { max, min } from 'ramda'
import Allègement from '../components/mecanisms/Allègement'
import { typeWarning } from '../error'
import {
	defaultNode,
	evaluateObject,
	parseObject,
	registerEvaluationFunction
} from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'
import { serializeUnit } from '../units'

const objectShape = {
	assiette: false,
	abattement: defaultNode(0),
	plafond: defaultNode(Infinity)
}

const evaluate = evaluateObject(function({
	assiette,
	abattement,
	plafond
}: any) {
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
		unit: assiette.unit,
		explanation: {
			plafond,
			abattement
		}
	}
})

export const mecanismReduction = (recurse, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		jsx: Allègement,
		explanation,
		category: 'mecanism',
		name: 'allègement',
		nodeKind: 'allègement',
		type: 'numeric',
		unit: explanation?.assiette?.unit
	}
}

registerEvaluationFunction('allègement', evaluate)
