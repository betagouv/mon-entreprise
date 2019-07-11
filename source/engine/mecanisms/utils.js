import Composantes from 'Engine/mecanismViews/Composantes'
import { add, dissoc, objOf } from 'ramda'
import { evaluateArrayWithFilter } from 'Engine/evaluation'
import { inferUnit } from 'Engine/units'

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

	let filter = situationGate => c =>
		!situationGate('sys.filter') ||
		!c.composante ||
		((!c.composante['dû par'] ||
			c.composante['dû par'] == situationGate('sys.filter')) &&
			(!c.composante['impôt sur le revenu'] ||
				c.composante['impôt sur le revenu'] == situationGate('sys.filter')))

	return {
		explanation,
		jsx: Composantes,
		evaluate: evaluateArrayWithFilter(filter, add, 0),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric',
		unit: inferUnit('+', explanation.map(e => e.unit))
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
