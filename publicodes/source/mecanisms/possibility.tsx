import { registerEvaluationFunction } from '../evaluation'

const evaluate = (cache, situation, parsedRules, node) => {
	return { ...node }
}

export const mecanismPossibility = (recurse, k, v) => {
	return {
		explanation: {},
		jsx: function Synchronisation({ explanation }) {
			return null
		},
		category: 'mecanism',
		name: 'possibilité',
		nodeKind: 'possibilité',
		type: 'possibilité'
	}
}

registerEvaluationFunction('possibilité', evaluate)
