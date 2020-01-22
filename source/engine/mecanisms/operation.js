import { typeWarning } from 'Engine/error'
import { evaluateNode, makeJsx, mergeMissing } from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { convertNodeToUnit } from 'Engine/nodeUnits'
import { inferUnit, serializeUnit } from 'Engine/units'
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
				console.log(serializeUnit(node1.unit), node1.unit)

				typeWarning(
					cache._meta.contextRule,
					`Dans l'expression '${
						node.operator
					}', la partie gauche (unité: ${serializeUnit(
						node1.unit
					)}) n'est pas compatible avec la partie droite (unité: ${serializeUnit(
						node2.unit
					)})`,
					e
				)
			}
		}
		let node1Value = node1.nodeValue
		let node2Value = node2.nodeValue
		try {
			;[node1Value, node2Value] = convertToDateIfNeeded(
				node1.nodeValue,
				node2.nodeValue
			)
		} catch (e) {
			typeWarning(
				cache._meta.contextRule,
				`Impossible de convertir une des valeur en date`,
				e
			)
		}
		let nodeValue = operatorFunction(node1Value, node2Value)

		let unit = inferUnit(k, [node1.unit, node2.unit])
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
					{(explanation[0].nodeValue !== 0 ||
						symbol !== '−' ||
						!v.explanation[0].constant) && (
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
