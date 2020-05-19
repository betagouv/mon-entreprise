import { add, dissoc, objOf } from 'ramda'
import { evaluateArrayWithFilter } from '../evaluation'
import { inferUnit } from '../units'
import Composantes from '../components/mecanisms/Composantes'

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

	let filter = situation => c =>
		!situation['_meta.filter'] ||
		!c.composante ||
		((!c.composante['dû par'] ||
			!['employeur', 'salarié'].includes(situation['_meta.filter']) ||
			c.composante['dû par'] == situation['_meta.filter']) &&
			(!c.composante['impôt sur le revenu'] ||
				!['déductible', 'non déductible'].includes(situation['_meta.filter']) ||
				c.composante['impôt sur le revenu'] == situation['_meta.filter']))

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
