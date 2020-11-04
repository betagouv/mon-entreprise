import {
	add,
	divide,
	equals,
	fromPairs,
	gt,
	gte,
	lt,
	lte,
	map,
	multiply,
	subtract
} from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Operation } from '../components/mecanisms/common'
import { convertToDate } from '../date'
import { typeWarning } from '../error'
import {
	makeJsx,
	mergeAllMissing,
	registerEvaluationFunction
} from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'
import { liftTemporal2, pureTemporal, temporalAverage } from '../temporal'
import { inferUnit, serializeUnit } from '../units'

const parse = (k, symbol) => (recurse, v) => {
	const explanation = v.explanation.map(recurse)
	const [node1, node2] = explanation
	const unit = inferUnit(k, [node1.unit, node2.unit])

	const jsx = ({ nodeValue, explanation, unit }) => (
		<Operation value={nodeValue} unit={unit}>
			{(explanation[0].nodeValue !== 0 ||
				symbol !== '−' ||
				!v.explanation[0].constant) && <>{makeJsx(explanation[0])}</>}{' '}
			{symbol || k} {makeJsx(explanation[1])}
		</Operation>
	)

	return {
		...v,
		jsx,
		nodeKind: 'operation',
		operationKind: k,
		operator: symbol || k,
		explanation,
		unit
	}
}

const evaluate: evaluationFunction = function(node: any) {
	const explanation = map(node => this.evaluateNode(node), node.explanation)
	let [node1, node2] = explanation
	const missingVariables = mergeAllMissing([node1, node2])

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
				this.cache._meta.contextRule,
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
		unit: inferUnit(node.operationKind, [node1.unit, node2.unit]),
		missingVariables
	}

	const operatorFunction = knownOperations[node.operationKind][0]

	const temporalValue = liftTemporal2(
		(a: string | false, b: string | false) => {
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
				a !== false &&
				b !== false &&
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

registerEvaluationFunction('operation', evaluate)

const knownOperations = {
	'*': [multiply, '×'],
	'/': [divide, '∕'],
	'+': [add],
	'-': [subtract, '−'],
	'<': [lt],
	'<=': [lte, '≤'],
	'>': [gt],
	'>=': [gte, '≥'],
	'=': [equals],
	'!=': [(a, b) => !equals(a, b), '≠']
}

const operationDispatch = fromPairs(
	Object.entries(knownOperations).map(([k, [f, symbol]]) => [
		k,
		parse(k, symbol)
	])
)

export default operationDispatch
