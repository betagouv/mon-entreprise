import Somme from '../components/mecanisms/Somme'
import { evaluateArray } from '../evaluation'
import { inferUnit } from '../units'

const evaluate = evaluateArray(
	(x, y) => (x === false && y === false ? false : x + y),
	false
)

export const mecanismSum = (recurse, k, v) => {
	const explanation = v.map(recurse)
	return {
		evaluate,
		jsx: Somme,
		explanation,
		category: 'mecanism',
		name: 'somme',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(r => r.unit)
		)
	}
}
