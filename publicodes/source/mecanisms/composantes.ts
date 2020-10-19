import { add, dissoc, filter, objOf } from 'ramda'
import { evaluateArray, registerEvaluationFunction } from '../evaluation'
import { inferUnit } from '../units'
import Composantes from '../components/mecanisms/Composantes'

export const evaluateComposantes = (cache, situation, parsedRules, node) => {
	const evaluationFilter = c =>
		!situation['_meta.filter'] ||
		!c.composante ||
		((!c.composante['dû par'] ||
			!['employeur', 'salarié'].includes(situation['_meta.filter']) ||
			c.composante['dû par'] == situation['_meta.filter']) &&
			(!c.composante['impôt sur le revenu'] ||
				!['déductible', 'non déductible'].includes(situation['_meta.filter']) ||
				c.composante['impôt sur le revenu'] == situation['_meta.filter']))

	return evaluateArray(add, 0)(
		cache,
		dissoc('_meta.filter', situation),
		parsedRules,
		{
			...node,
			explanation: filter(evaluationFilter, node.explanation)
		}
	)
}

export const decompose = (recurse, k, v) => {
	const subProps = dissoc<Record<string, unknown>>('composantes', v)
	const explanation = v.composantes.map(c => ({
		...recurse(
			objOf(k, {
				...subProps,
				...dissoc<Record<string, unknown>>('attributs', c)
			})
		),
		composante: c.nom ? { nom: c.nom } : c.attributs
	}))

	return {
		explanation,
		jsx: Composantes,
		nodeKind: 'composantes',
		category: 'mecanism',
		name: 'composantes',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(e => e.unit)
		)
	}
}

registerEvaluationFunction('composantes', evaluateComposantes)
