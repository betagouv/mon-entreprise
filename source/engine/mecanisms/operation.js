import { typeWarning } from 'Engine/error'
import { evaluateNode, makeJsx, mergeMissing } from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { convertNodeToUnit } from 'Engine/nodeUnits'
import { inferUnit, serialiseUnit } from 'Engine/units'
import { curry, map } from 'ramda'
import React from 'react'
import { convertToDateIfNeeded } from '../date.ts'

export default (k, operatorFunction, symbol) => (recurse, k, v) => {
	let evaluate = (cache, situation, parsedRules, node) => {
		const explanation = map(
			curry(evaluateNode)(cache, situation, parsedRules),
			node.explanation
		)
		let [node1, node2] = explanation
		const missingVariables = mergeMissing(
			node1.missingVariables,
			node2.missingVariables
		)

		if (node1.nodeValue == null || node2.nodeValue == null) {
			return { ...node, nodeValue: null, explanation, missingVariables }
		}
		if (!['∕', '×'].includes(node.operator)) {
			try {
				if (node1.unit) {
					node2 = convertNodeToUnit(node1.unit, node2)
				} else if (node2.unit) {
					node1 = convertNodeToUnit(node2.unit, node1)
				}
			} catch (e) {
				typeWarning(
					cache._meta.contextRule,
					`Dans l'expression '${
						node.operator
					}', la partie gauche (unité: ${serialiseUnit(
						node1.unit
					)}) n'est pas compatible avec la partie droite (unité: ${serialiseUnit(
						node2.unit
					)})`,
					e
				)
			}
		}
		let nodeValue = operatorFunction(
			...convertToDateIfNeeded(node1.nodeValue, node2.nodeValue)
		)
		let unit = inferUnit(k, [node1.unit, node2.unit])
		// if (node1.name === 'revenu professionnel') {
		// 	console.log(
		// 		node1.name,
		// 		node2.name,
		// 		serialiseUnit(node1.unit),
		// 		serialiseUnit(node2.unit),
		// 		serialiseUnit(unit)
		// 	)
		// }
		return {
			...node,
			nodeValue,
			unit,
			explanation,
			missingVariables
		}
	}

	let explanation = v.explanation.map(recurse)
	let [node1, node2] = explanation
	let unit = inferUnit(k, [node1.unit, node2.unit])

	let jsx = (nodeValue, explanation, _, unit) => (
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
