import React from 'react'
import { evaluationFunction } from '..'
import { Mecanism } from '../components/mecanisms/common'
import { convertToDate, convertToString } from '../date'
import {
	defaultNode,
	makeJsx,
	mergeAllMissing,
	parseObject,
	registerEvaluationFunction
} from '../evaluation'
import { parseUnit } from '../units'

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

const evaluate: evaluationFunction = function(node) {
	const from = this.evaluateNode(node.explanation.depuis)
	const to = this.evaluateNode(node.explanation["jusqu'à"])
	let nodeValue
	if ([from, to].some(({ nodeValue }) => nodeValue === null)) {
		nodeValue = null
	} else {
		const [fromDate, toDate] = [from.nodeValue, to.nodeValue].map(convertToDate)
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

export default (recurse, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		jsx: MecanismDurée,
		explanation,
		category: 'mecanism',
		name: 'Durée',
		nodeKind: 'durée',
		type: 'numeric',
		unit: parseUnit('jours')
	}
}

registerEvaluationFunction('durée', evaluate)
