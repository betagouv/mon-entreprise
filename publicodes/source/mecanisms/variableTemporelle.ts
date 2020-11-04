import { evaluationFunction } from '..'
import { registerEvaluationFunction } from '../evaluation'
import {
	createTemporalEvaluation,
	narrowTemporalValue,
	Temporal,
	temporalAverage
} from '../temporal'

const evaluate: evaluationFunction = function(node: any) {
	const start =
		node.explanation.period.start &&
		this.evaluateNode(node.explanation.period.start)
	const end =
		node.explanation.period.end &&
		this.evaluateNode(node.explanation.period.end)
	const value = this.evaluateNode(node.explanation.value)
	const period = {
		start: start?.nodeValue || null,
		end: end?.nodeValue || null
	}
	const temporalValue = value.temporalValue
		? narrowTemporalValue(period, value.temporalValue)
		: createTemporalEvaluation(value.nodeValue, period)
	// TODO explanation missingVariables / period missing variables
	return {
		...node,
		nodeValue: temporalAverage(temporalValue as Temporal<number>, value.unit),
		temporalValue,
		explanation: {
			period: { start, end },
			value
		},
		unit: value.unit
	}
}

export default function parseVariableTemporelle(parse, v) {
	const explanation = parse(v.explanation)
	return {
		nodeKind: 'variable temporelle',
		explanation: {
			period: {
				start: v.period.start && parse(v.period.start),
				end: v.period.end && parse(v.period.end)
			},
			value: explanation
		},
		unit: explanation.unit
	}
}

registerEvaluationFunction('variable temporelle', evaluate)
