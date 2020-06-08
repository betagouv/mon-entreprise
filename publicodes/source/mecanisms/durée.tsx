import { convertToDate, convertToString } from '../date'
import {
	defaultNode,
	evaluateNode,
	makeJsx,
	mergeMissing,
	parseObject
} from '../evaluation'
import { Mecanism } from '../components/mecanisms/common'
import { parseUnit } from '../units'
import React from 'react'

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

const evaluate = (cache, situation, parsedRules, node) => {
	const evaluateAttribute = evaluateNode.bind(
		null,
		cache,
		situation,
		parsedRules
	)
	const from = evaluateAttribute(node.explanation.depuis)
	const to = evaluateAttribute(node.explanation["jusqu'à"])
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

export default (recurse, v) => {
	const explanation = parseObject(recurse, objectShape, v)

	return {
		evaluate,
		jsx: MecanismDurée,
		explanation,
		category: 'mecanism',
		name: 'Durée',
		type: 'numeric',
		unit: parseUnit('jours')
	}
}
