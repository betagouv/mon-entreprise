import { evaluateNode, makeJsx, mergeMissing } from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { inferUnit } from 'Engine/units'
import { curry, map } from 'ramda'
import React from 'react'
import { convertToDateIfNeeded } from '../date.ts'

export default (k, operatorFunction, symbol) => (recurse, k, v) => {
	let evaluate = (cache, situation, parsedRules, node) => {
		const explanation = map(
			curry(evaluateNode)(cache, situation, parsedRules),
			node.explanation
		)
		const missingVariables = mergeMissing(
			explanation[0].missingVariables,
			explanation[1].missingVariables
		)

		const value1 = explanation[0].nodeValue
		const value2 = explanation[1].nodeValue
		if (value1 == null || value2 == null) {
			return { ...node, nodeValue: null, explanation, missingVariables }
		}
		let nodeValue = operatorFunction(...convertToDateIfNeeded(value1, value2))

		return {
			...node,
			nodeValue,
			explanation,
			missingVariables
		}
	}

	let explanation = v.explanation.map(recurse)

	let unit = inferUnit(k, [explanation[0].unit, explanation[1].unit])

	let jsx = (nodeValue, explanation) => (
		<Node
			classes={'inlineExpression ' + k}
			value={nodeValue}
			unit={unit}
			child={
				<span className="nodeContent">
					{(explanation[0].nodeValue !== 0 || symbol !== '−') && (
						<>
							<span className="fa fa" />
							{makeJsx(explanation[0])}
						</>
					)}
					<span className="operator">{symbol || k}</span>
					{makeJsx(explanation[1])}
				</span>
			}
		/>
	)

	return {
		...v,
		evaluate,
		jsx,
		operator: symbol || k,
		explanation,
		unit
	}
}
