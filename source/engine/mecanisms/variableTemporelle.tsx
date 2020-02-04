import { bonus, evaluateNode, mergeMissing } from 'Engine/evaluation'
import { isValidPeriod, periodIntersection } from 'Engine/period'

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
	const period = periodIntersection(explanation.period, { start, end })
	let nodeValue: any = null
	let missingVariables = mergeMissing(
		period.start?.missingVariables,
		period.end?.missingVariables
	)
	if (isValidPeriod(period)) {
		nodeValue = explanation.nodeValue
		missingVariables = mergeMissing(
			bonus(missingVariables, true),
			explanation.missingVariables
		)
	} else {
		nodeValue = false
	}
	return {
		...node,
		nodeValue,
		period,
		explanation,
		missingVariables
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
