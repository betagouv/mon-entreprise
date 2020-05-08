import { evaluateNode } from '../evaluation'
import {
	createTemporalEvaluation,
	narrowTemporalValue,
	Temporal,
	temporalAverage
} from '../temporal'

function evaluate(
	cache: any,
	situation: any,
	parsedRules: any,
	node: ReturnType<typeof parseVariableTemporelle>
) {
	const evaluateAttribute = evaluateNode.bind(
		null,
		cache,
		situation,
		parsedRules
	)

	const start =
		node.explanation.period.start &&
		evaluateAttribute(node.explanation.period.start)
	const end =
		node.explanation.period.end &&
		evaluateAttribute(node.explanation.period.end)
	const value = evaluateAttribute(node.explanation.value)
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

export default function parseVariableTemporelle(parse, __, v: any) {
	const explanation = parse(v.explanation)
	return {
		evaluate,
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
