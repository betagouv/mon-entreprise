import { convertToDate } from 'Engine/date'
import { typeWarning } from 'Engine/error'
import { evaluateNode, makeJsx, mergeMissing } from 'Engine/evaluation'
import { Node } from 'Engine/mecanismViews/common'
import { convertNodeToUnit } from 'Engine/nodeUnits'
import { liftTemporal2, pureTemporal, temporalAverage } from 'Engine/temporal'
import { inferUnit, serializeUnit } from 'Engine/units'
import { curry, map } from 'ramda'
import React from 'react'

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
					}', la partie gauche (unité: ${serializeUnit(
						node1.unit
					)}) n'est pas compatible avec la partie droite (unité: ${serializeUnit(
						node2.unit
					)})`,
					e
				)
			}
		}
		const baseNode = {
			...node,
			explanation,
			unit: inferUnit(k, [node1.unit, node2.unit]),
			missingVariables
		}

		let temporalValue = liftTemporal2(
			(a, b) => {
				if (!['≠', '='].includes(node.operator) && a === false && b === false) {
					return false
				}
				if (
					['<', '>', '≤', '≥', '∕', '×'].includes(node.operator) &&
					(a === false || b === false)
				) {
					return false
				}
				if (
					['≠', '=', '<', '>', '≤', '≥'].includes(node.operator) &&
					[a, b].every(value => value.match?.(/[\d]{2}\/[\d]{2}\/[\d]{4}/))
				) {
					return operatorFunction(convertToDate(a), convertToDate(b))
				}
				return operatorFunction(a, b)
			},
			node1.temporalValue ?? pureTemporal(node1.nodeValue),
			node2.temporalValue ?? pureTemporal(node2.nodeValue)
		)
		const nodeValue = temporalAverage(temporalValue, baseNode.unit)

		return {
			...baseNode,
			nodeValue,
			...(temporalValue.length > 1 && { temporalValue })
		}
	}

	let explanation = v.explanation.map(recurse)
	let [node1, node2] = explanation
	let unit = inferUnit(k, [node1.unit, node2.unit])

	let jsx = (nodeValue, explanation, _, unit) => (
		<Node classes={'inlineExpression ' + k} value={nodeValue} unit={unit}>
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
		</Node>
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
