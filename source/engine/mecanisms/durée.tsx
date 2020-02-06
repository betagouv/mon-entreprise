import { convertToDate, normalizeDate } from 'Engine/date'
import {
	defaultNode,
	evaluateNode,
	makeJsx,
	mergeMissing,
	parseObject
} from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { parseUnit } from 'Engine/units'
import React from 'react'

function MecanismDurée({ nodeValue, explanation, unit }) {
	return (
		<Node
			classes="mecanism durée"
			name="durée"
			value={nodeValue}
			unit={unit}
			child={
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
			}
		/>
	)
}
const today = new Date()
const todayString = normalizeDate(
	today.getFullYear(),
	today.getMonth() + 1,
	today.getDate()
)

const objectShape = {
	depuis: defaultNode(todayString),
	"jusqu'à": defaultNode(todayString)
}

const evaluate = (cache, situation, parsedRules, node) => {
	let evaluateAttribute = evaluateNode.bind(null, cache, situation, parsedRules)
	let from = evaluateAttribute(node.explanation.depuis)
	let to = evaluateAttribute(node.explanation["jusqu'à"])
	let nodeValue
	if ([from, to].some(({ nodeValue }) => nodeValue === null)) {
		nodeValue = null
	} else {
		let [fromDate, toDate] = [from.nodeValue, to.nodeValue].map(convertToDate)
		nodeValue = Math.max(
			0,
			Math.round(
				(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
			)
		)
	}
	const missingVariables = mergeMissing(
		from.missingVariables,
		to.missingVariables
	)
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

export default (recurse, k, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		evaluate,
		// eslint-disable-next-line
		jsx: (nodeValue, explanation, _, unit) => (
			<MecanismDurée
				nodeValue={nodeValue}
				explanation={explanation}
				unit={unit}
			/>
		),
		explanation,
		category: 'mecanism',
		name: 'Durée',
		type: 'numeric',
		unit: parseUnit('jours')
	}
}
