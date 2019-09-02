import { defaultNode, evaluateObject, parseObject } from 'Engine/evaluation'
import { decompose } from 'Engine/mecanisms/utils'
import variations from 'Engine/mecanisms/variations'
import Barème from 'Engine/mecanismViews/Barème'
import { val } from 'Engine/traverse-common-functions'
import { desugarScale } from './barème'
/* on réécrit en une syntaxe plus bas niveau mais plus régulière les tranches :
	`en-dessous de: 1`
	devient
	```
	de: 0
	à: 1
	```
	*/

export default (recurse, k, v) => {
	if (v.composantes) {
		//mécanisme de composantes. Voir known-mecanisms.md/composantes
		return decompose(recurse, k, v)
	}
	if (v.variations) {
		return variations(recurse, k, v, true)
	}
	let tranches = desugarScale(recurse)(v['tranches']),
		objectShape = {
			assiette: false,
			multiplicateur: defaultNode(1)
		}

	let effect = ({ assiette, multiplicateur, tranches }) => {
		if (val(assiette) === null) return null

		let roundedAssiette = Math.round(val(assiette))

		let matchedTranche = tranches.find(
			({ de: min, à: max }) =>
				roundedAssiette >= val(multiplicateur) * min &&
				roundedAssiette <= max * val(multiplicateur)
		)

		if (!matchedTranche) return 0
		if (matchedTranche.taux)
			return matchedTranche.taux.nodeValue * val(assiette)
		return matchedTranche.montant
	}

	let explanation = {
			...parseObject(recurse, objectShape, v),
			tranches
		},
		evaluate = evaluateObject(objectShape, effect)

	return {
		evaluate,
		jsx: Barème('linéaire'),
		explanation,
		category: 'mecanism',
		name: 'barème linéaire',
		barème: 'en taux',
		type: 'numeric',

		unit: v['unité'] || explanation.assiette.unit
	}
}
