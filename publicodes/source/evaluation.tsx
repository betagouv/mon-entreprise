import {
	add,
	evolve,
	fromPairs,
	keys,
	map,
	mapObjIndexed,
	mergeWith,
	reduce
} from 'ramda'
import React from 'react'
import Engine, { evaluationFunction } from '.'
import {
	ASTNode,
	ConstantNode,
	Evaluation,
	EvaluationDecoration,
	NodeKind
} from './AST/types'
import { typeWarning } from './error'
import { convertNodeToUnit, simplifyNodeUnit } from './nodeUnits'
import parse from './parse'
import {
	concatTemporals,
	liftTemporalNode,
	mapTemporal,
	pureTemporal,
	Temporal,
	temporalAverage,
	zipTemporals
} from './temporal'

export const makeJsx = (node: ASTNode): JSX.Element => {
	const Component = node.jsx
	return <Component {...node} />
}

export const collectNodeMissing = node => node?.missingVariables || {}

export const bonus = (missings, hasCondition = true) =>
	hasCondition ? map(x => x + 0.0001, missings || {}) : missings
export const mergeAllMissing = missings =>
	missings.map(collectNodeMissing).reduce(mergeMissing, {})
export const mergeMissing = (left, right) =>
	mergeWith(add, left || {}, right || {})

function convertNodesToSameUnit(nodes, contextRule, mecanismName) {
	const firstNodeWithUnit = nodes.find(node => !!node.unit)
	if (!firstNodeWithUnit) {
		return nodes
	}
	return nodes.map(node => {
		try {
			return convertNodeToUnit(firstNodeWithUnit.unit, node)
		} catch (e) {
			typeWarning(
				contextRule,
				`Dans le mécanisme ${mecanismName}, les unités des éléments suivants sont incompatibles entre elles : \n\t\t${node?.name ||
					node?.rawNode}\n\t\t${firstNodeWithUnit?.name ||
					firstNodeWithUnit?.rawNode}'`,
				e
			)
			return node
		}
	})
}

export const evaluateArray: <NodeName extends NodeKind>(
	reducer: Parameters<typeof reduce>[0],
	start: Parameters<typeof reduce>[1]
) => evaluationFunction<NodeName> = (reducer, start) =>
	function(node: any) {
		const evaluate = this.evaluateNode.bind(this)
		const evaluatedNodes = convertNodesToSameUnit(
			node.explanation.map(evaluate),
			this.cache._meta.contextRule,
			node.name
		)

		const temporalValues = concatTemporals(
			evaluatedNodes.map(
				({ temporalValue, nodeValue }) =>
					temporalValue ?? pureTemporal(nodeValue)
			)
		)
		const temporalValue = mapTemporal(values => {
			if (values.some(value => value === null)) {
				return null
			}
			return reduce(reducer, start, values)
		}, temporalValues)

		const baseEvaluation = {
			...node,
			missingVariables: mergeAllMissing(evaluatedNodes),
			explanation: evaluatedNodes,
			...(evaluatedNodes[0] && { unit: evaluatedNodes[0].unit })
		}
		if (temporalValue.length === 1) {
			return {
				...baseEvaluation,
				nodeValue: temporalValue[0].value
			}
		}

		return {
			...baseEvaluation,
			temporalValue,
			nodeValue: temporalAverage(temporalValue as any)
		}
	}

export const defaultNode = (nodeValue: Evaluation) =>
	({
		nodeValue,
		type: typeof nodeValue,
		// eslint-disable-next-line
		jsx: ({ nodeValue }: ASTNode & EvaluationDecoration) => (
			<span className="value">{nodeValue}</span>
		),
		isDefault: true,
		nodeKind: 'constant'
	} as ConstantNode)

export const parseObject = (objectShape, value, context) => {
	const recurseOne = key => defaultValue => {
		if (value[key] == null && !defaultValue)
			throw new Error(
				`Il manque une clé '${key}' dans ${JSON.stringify(value)} `
			)
		return value[key] != null ? parse(value[key], context) : defaultValue
	}
	const transforms = fromPairs(
		map(k => [k, recurseOne(k)], keys(objectShape)) as any
	)
	return evolve(transforms as any, objectShape)
}

export function evaluateObject<NodeName extends NodeKind>(
	effet: (this: Engine, explanations: any) => any
) {
	return function(node) {
		const evaluate = this.evaluateNode.bind(this)
		const evaluations = mapObjIndexed(
			evaluate as any,
			(node as any).explanation
		)
		const temporalExplanations = mapTemporal(
			Object.fromEntries,
			concatTemporals(
				Object.entries(evaluations).map(([key, node]) =>
					zipTemporals(pureTemporal(key), liftTemporalNode(node as ASTNode))
				)
			)
		)
		const temporalExplanation = mapTemporal(explanations => {
			const evaluation = effet.call(this, explanations)
			return {
				...evaluation,
				explanation: {
					...explanations,
					...evaluation.explanation
				}
			}
		}, temporalExplanations)

		const sameUnitTemporalExplanation: Temporal<ASTNode &
			EvaluationDecoration & { nodeValue: number }> = convertNodesToSameUnit(
			temporalExplanation.map(x => x.value),
			this.cache._meta.contextRule,
			node.nodeKind
		).map((node, i) => ({
			...temporalExplanation[i],
			value: simplifyNodeUnit(node)
		}))

		const temporalValue = mapTemporal(
			({ nodeValue }) => nodeValue,
			sameUnitTemporalExplanation
		)
		const nodeValue = temporalAverage(temporalValue)
		const baseEvaluation = {
			...node,
			nodeValue,
			unit: sameUnitTemporalExplanation[0].value.unit,
			explanation: evaluations,
			missingVariables: mergeAllMissing(Object.values(evaluations))
		}
		if (sameUnitTemporalExplanation.length === 1) {
			return {
				...baseEvaluation,
				explanation: (sameUnitTemporalExplanation[0] as any).value
			}
		}
		return {
			...baseEvaluation,
			temporalValue,
			temporalExplanation
		}
	} as evaluationFunction<NodeName>
}
