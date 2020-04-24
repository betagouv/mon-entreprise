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
			!['employeur', 'salarié'].includes(situationGate('sys.filter')) ||
			c.composante['dû par'] == situationGate('sys.filter')) &&
			(!c.composante['impôt sur le revenu'] ||
				!['déductible', 'non déductible'].includes(
					situationGate('sys.filter')
				) ||
				c.composante['impôt sur le revenu'] == situationGate('sys.filter')))

	return {
		explanation,
		jsx: Composantes,
		evaluate: evaluateArrayWithFilter(filter, add, 0),
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(e => e.unit)
		)
	}
}
