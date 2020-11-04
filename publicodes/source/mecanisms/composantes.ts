import { add, dissoc, filter, objOf } from 'ramda'
import { evaluationFunction } from '..'
import Composantes from '../components/mecanisms/Composantes'
import { evaluateArray, registerEvaluationFunction } from '../evaluation'
import { inferUnit } from '../units'

export const evaluateComposantes: evaluationFunction = function(node) {
	const evaluationFilter = c =>
		!this.cache._meta.filter ||
		!c.composante ||
		((!c.composante['dû par'] ||
			!['employeur', 'salarié'].includes(this.cache._meta.filter as any) ||
			c.composante['dû par'] == this.cache._meta.filter) &&
			(!c.composante['impôt sur le revenu'] ||
				!['déductible', 'non déductible'].includes(
					this.cache._meta.filter as any
				) ||
				c.composante['impôt sur le revenu'] == this.cache._meta.filter))
	return evaluateArray(add as any, 0).call(this, {
		...node,
		explanation: filter(evaluationFilter, node.explanation)
	})
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
