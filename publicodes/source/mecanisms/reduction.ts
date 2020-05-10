import { map, max, min } from 'ramda'
import Allègement from '../components/mecanisms/Allègement'
import { typeWarning } from '../error'
import { defaultNode, evaluateObject, parseObject } from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'
import { parseUnit, serializeUnit } from '../units'

export const mecanismReduction = (recurse, k, v) => {
	const objectShape = {
		assiette: false,
		abattement: defaultNode(0),
		plafond: defaultNode(Infinity),
		franchise: defaultNode(0)
	}

	const effect = (
		{ assiette, abattement, plafond, franchise, décote },
		cache
	) => {
		const assietteValue = assiette.nodeValue
		if (assietteValue == null) return { nodeValue: null }
		if (assiette.unit) {
			try {
				franchise = convertNodeToUnit(assiette.unit, franchise)
				plafond = convertNodeToUnit(assiette.unit, plafond)
				if (serializeUnit(abattement.unit) !== '%') {
					abattement = convertNodeToUnit(assiette.unit, abattement)
				}
				if (décote) {
					décote.plafond = convertNodeToUnit(assiette.unit, décote.plafond)
					décote.taux = convertNodeToUnit(parseUnit(''), décote.taux)
				}
			} catch (e) {
				typeWarning(
					cache._meta.contextRule,
					"Impossible de convertir les unités de l'allègement entre elles",
					e
				)
			}
		}
		const montantFranchiséDécoté =
			franchise.nodeValue && assietteValue < franchise.nodeValue
				? 0
				: décote
				? (function() {
						const plafondDécote = décote.plafond.nodeValue,
							taux = décote.taux.nodeValue

						return assietteValue > plafondDécote
							? assietteValue
							: max(0, (1 + taux) * assietteValue - taux * plafondDécote)
				  })()
				: assietteValue
		const nodeValue = abattement
			? abattement.nodeValue == null
				? montantFranchiséDécoté === 0
					? 0
					: null
				: serializeUnit(abattement.unit) === '%'
				? max(
						0,
						montantFranchiséDécoté -
							min(
								plafond.nodeValue,
								(abattement.nodeValue / 100) * montantFranchiséDécoté
							)
				  )
				: max(
						0,
						montantFranchiséDécoté -
							min(plafond.nodeValue, abattement.nodeValue)
				  )
			: montantFranchiséDécoté
		return {
			nodeValue,
			unit: assiette.unit,
			explanation: {
				franchise,
				plafond,
				abattement
			}
		}
	}

	const base = parseObject(recurse, objectShape, v),
		explanation = v.décote
			? {
					...base,
					décote: map(recurse, v.décote)
			  }
			: base,
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Allègement,
		explanation,
		category: 'mecanism',
		name: 'allègement',
		type: 'numeric',
		unit: explanation?.assiette?.unit
	}
}
