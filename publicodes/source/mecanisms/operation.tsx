import { equals, fromPairs, map } from 'ramda'
import React from 'react'
import { evaluationFunction } from '..'
import { Operation } from '../components/mecanisms/common'
import { ASTNode } from '../AST/types'
import { convertToDate } from '../date'
import { typeWarning } from '../error'
import { makeJsx, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'
import { liftTemporal2, pureTemporal, temporalAverage } from '../temporal'
import { EvaluatedNode } from '../AST/types'
import { inferUnit, serializeUnit } from '../units'

const knownOperations = {
	'*': [(a, b) => a * b, '×'],
	'/': [(a, b) => a / b, '∕'],
	'+': [(a, b) => a + b],
	'-': [(a, b) => a - b, '−'],
	'<': [(a, b) => a < b],
	'<=': [(a, b) => a <= b, '≤'],
	'>': [(a, b) => a > b],
	'>=': [(a, b) => a >= b, '≥'],
	'=': [(a, b) => equals(a, b)],
	'!=': [(a, b) => !equals(a, b), '≠'],
} as const
export type OperationNode = {
	nodeKind: 'operation'
	explanation: [ASTNode, ASTNode]
	operationKind: keyof typeof knownOperations
	operator: string
	jsx: any
}

const parseOperation = (k, symbol) => (v, context) => {
	const explanation = v.explanation.map((node) => parse(node, context))

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
	} as OperationNode
}

const evaluate: evaluationFunction<'operation'> = function (node) {
	const explanation = node.explanation.map((node) =>
		this.evaluateNode(node)
	) as [EvaluatedNode, EvaluatedNode]
	let [node1, node2] = explanation
	const missingVariables = mergeAllMissing([node1, node2])

	if (node1.nodeValue == null || node2.nodeValue == null) {
		return { ...node, nodeValue: null, explanation, missingVariables }
	}
	if (!['∕', '×'].includes(node.operator)) {
		try {
			if (node1.unit && 'unit' in node2) {
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
		...((node.operationKind === '*' ||
			node.operationKind === '/' ||
			node.operationKind === '-' ||
			node.operationKind === '+') && {
			unit: inferUnit(node.operationKind, [node1.unit, node2.unit]),
		}),
		missingVariables,
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
				[a, b].every((value) => value.match?.(/[\d]{2}\/[\d]{2}\/[\d]{4}/))
			) {
				return operatorFunction(convertToDate(a), convertToDate(b))
			}
			return operatorFunction(a, b)
		},
		node1.temporalValue ?? (pureTemporal(node1.nodeValue) as any),
		node2.temporalValue ?? (pureTemporal(node2.nodeValue) as any)
	)
	const nodeValue = temporalAverage(temporalValue, baseNode.unit)

	return {
		...baseNode,
		nodeValue,
		...(temporalValue.length > 1 && { temporalValue }),
	}
}

registerEvaluationFunction('operation', evaluate)

const operationDispatch = fromPairs(
	Object.entries(knownOperations).map(([k, [f, symbol]]) => [
		k,
		parseOperation(k, symbol),
	])
)

export default operationDispatch
