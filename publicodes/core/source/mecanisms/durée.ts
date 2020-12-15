import { EvaluationFunction } from '..'
import { ASTNode, Unit } from '../AST/types'
import { convertToDate, convertToString } from '../date'
import { defaultNode, mergeAllMissing, parseObject } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { parseUnit } from '../units'

export type DuréeNode = {
	explanation: {
		depuis: ASTNode
		"jusqu'à": ASTNode
	}
	unit: Unit
	nodeKind: 'durée'
}

const todayString = convertToString(new Date())
const objectShape = {
	depuis: defaultNode(todayString),
	"jusqu'à": defaultNode(todayString),
}
const evaluate: EvaluationFunction<'durée'> = function (node) {
	const from = this.evaluate(node.explanation.depuis)
	const to = this.evaluate(node.explanation["jusqu'à"])
	let nodeValue
	if ([from, to].some(({ nodeValue }) => nodeValue === null)) {
		nodeValue = null
	} else {
		const [fromDate, toDate] = [from.nodeValue, to.nodeValue].map(
			convertToDate as any
		)
		nodeValue = Math.max(
			0,
			Math.round(
				(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
			)
		)
	}
	const missingVariables = mergeAllMissing([from, to])
	return {
		...node,
		missingVariables,
		nodeValue,
		explanation: {
			depuis: from,
			"jusqu'à": to,
		},
	}
}

export default (v, context) => {
	const explanation = parseObject(objectShape, v, context)
	return {
		explanation,
		unit: parseUnit('jours'),
		nodeKind: 'durée',
	} as DuréeNode
}

registerEvaluationFunction('durée', evaluate)
