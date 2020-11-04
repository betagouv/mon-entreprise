import Somme from '../components/mecanisms/Somme'
import { evaluateArray, registerEvaluationFunction } from '../evaluation'
import { inferUnit } from '../units'

const evaluate = evaluateArray(
	(x: any, y: any) => (x === false && y === false ? false : x + y),
	false
)

export const mecanismSum = (recurse, v) => {
	const explanation = v.map(recurse)
	return {
		jsx: Somme,
		explanation,
		category: 'mecanism',
		name: 'somme',
		nodeKind: 'somme',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(r => r.unit)
		)
	}
}

registerEvaluationFunction('somme', evaluate)
