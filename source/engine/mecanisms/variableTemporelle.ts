import { evaluateNode } from 'Engine/evaluation'
import {
	createTemporalEvaluation,
	narrowTemporalValue,
	periodAverage
} from 'Engine/period'
import { Temporal } from './../period'

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

	const start = node.period.start && evaluateAttribute(node.period.start)
	const end = node.period.end && evaluateAttribute(node.period.end)
	const explanation = evaluateAttribute(node.explanation)
	const period = {
		start: start?.nodeValue ?? null,
		end: end?.nodeValue ?? null
	}

	const temporalValue = explanation.temporalValue
		? narrowTemporalValue(period, explanation.temporalValue)
		: createTemporalEvaluation(explanation.nodeValue, period)
	// TODO explanation missingVariables / period missing variables

	return {
		...node,
		nodeValue: periodAverage(temporalValue as Temporal<number>),
		temporalValue,
		period: { start, end },
		explanation
	}
}

export default function parseVariableTemporelle(parse, __, v: any) {
	return {
		evaluate,
		explanation: parse(v.explanation),
		period: {
			start: v.period.start && parse(v.period.start),
			end: v.period.end && parse(v.period.end)
		}
	}
}
