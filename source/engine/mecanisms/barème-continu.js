import { defaultNode, evaluateObject, parseObject } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import BarèmeContinu from 'Engine/mecanismViews/BarèmeContinu'
import { anyNull, val } from 'Engine/traverse-common-functions'
import { parseUnit } from 'Engine/units'
import {
	aperture,
	isEmpty,
	last,
	pipe,
	reduce,
	reduced,
	sort,
	toPairs
} from 'ramda'
export default (recurse, k, v) => {
	if (v.composantes) {
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return variations(recurse, k, v, true)
	}
	if (!v.points || typeof v.points !== 'object' || isEmpty(v.points)) {
		throw new Error(
			'Le mécanisme `barème linéaire` doit avoir un paramètre `points` valide'
		)
	}
	let objectShape = {
		assiette: false,
		multiplicateur: defaultNode(1)
	}
	let returnRate = v['retourne seulement le taux'] === 'oui'
	let effect = ({ assiette, multiplicateur, points }) => {
		if (anyNull([assiette, multiplicateur])) return null
		//We'll build a linear function given the two constraints that must be respected
		let result = pipe(
			toPairs,
			// we don't rely on the sorting of objects
			sort(([k1], [k2]) => k1 - k2),
			points => [...points, [Infinity, last(points)[1]]],
			aperture(2),
			reduce((_, [[lowerLimit, lowerRate], [upperLimit, upperRate]]) => {
				let x1 = val(multiplicateur) * lowerLimit,
					x2 = val(multiplicateur) * upperLimit,
					y1 = (val(assiette) * val(recurse(lowerRate))) / 100,
					y2 = (val(assiette) * val(recurse(upperRate))) / 100
				if (val(assiette) > x1 && val(assiette) <= x2) {
					// Outside of these 2 limits, it's a linear function a * x + b
					let a = (y2 - y1) / (x2 - x1),
						b = y1 - x1 * a,
						nodeValue = a * val(assiette) + b,
						taux = nodeValue / val(assiette)
					return reduced({
						nodeValue: returnRate ? taux * 100 : nodeValue,
						additionalExplanation: {
							seuil: val(assiette) / val(multiplicateur),
							taux,
							unit: returnRate ? parseUnit('%') : assiette.unit
						}
					})
				}
			}, 0)
		)(points)
		return result
	}
	let explanation = {
			...parseObject(recurse, objectShape, v),
			points: v.points,
			returnRate
		},
		evaluate = evaluateObject(objectShape, effect)
	return {
		evaluate,
		jsx: BarèmeContinu,
		explanation,
		category: 'mecanism',
		name: 'barème continu',
		type: 'numeric',
		unit: returnRate ? parseUnit('%') : explanation.assiette.unit
	}
}
