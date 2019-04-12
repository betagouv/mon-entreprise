import Composantes from 'Engine/mecanismViews/Composantes'
import { add, dissoc, objOf } from 'ramda'
import { evaluateArray } from 'Engine/evaluation'

export let decompose = (recurse, k, v) => {
	let subProps = dissoc('composantes')(v),
		explanation = v.composantes.map(c => ({
			...recurse(
				objOf(k, {
					...subProps,
					...dissoc('attributs')(c)
				})
			),
			composante: c.nom ? { nom: c.nom } : c.attributs
		}))

	return {
		explanation,
		jsx: Composantes,
		evaluate: evaluateArray(add, 0, true),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric'
	}
}

export let devariateExplanation = (recurse, mecanismKey, v) => {
	let fixedProps = dissoc('variations')(v),
		explanation = v.variations.map(({ si, alors, sinon }) => ({
			consequence: recurse({
				[mecanismKey]: {
					...fixedProps,
					...(sinon || alors)
				}
			}),
			condition: sinon ? undefined : recurse(si)
		}))

	return explanation
}
