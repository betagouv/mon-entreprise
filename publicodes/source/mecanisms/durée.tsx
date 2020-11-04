import React from 'react'
import { evaluationFunction } from '..'
import { ASTNode } from '../AST/types'
import { Mecanism } from '../components/mecanisms/common'
import { convertToDate, convertToString } from '../date'
import {
	defaultNode,
	makeJsx,
	mergeAllMissing,
	parseObject
} from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'

export type DuréeNode = {
	explanation: {
		depuis: ASTNode
		"jusqu'à": ASTNode
	}
	jsx: any
	nodeKind: 'durée'
}

function MecanismDurée({ nodeValue, explanation, unit }) {
	return (
		<Mecanism name="durée" value={nodeValue} unit={unit}>
			<>
				<p>
					<strong className="key">Depuis : </strong>
					<span className="value">{makeJsx(explanation.depuis)}</span>
				</p>
				<p>
					<strong className="key">Jusqu'à : </strong>
					<span className="value">{makeJsx(explanation["jusqu'à"])}</span>
				</p>
			</>
		</Mecanism>
	)
}
const todayString = convertToString(new Date())
const objectShape = {
	depuis: defaultNode(todayString),
	"jusqu'à": defaultNode(todayString)
}
const evaluate: evaluationFunction<'durée'> = function(node) {
	const from = this.evaluateNode(node.explanation.depuis)
	const to = this.evaluateNode(node.explanation["jusqu'à"])
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
			"jusqu'à": to
		}
	}
}

export default (v, context) => {
	const explanation = parseObject(objectShape, v, context)
	return {
		jsx: MecanismDurée,
		explanation,
		nodeKind: 'durée'
	} as DuréeNode
}

registerEvaluationFunction('durée', evaluate)
