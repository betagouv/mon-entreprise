import Engine, { EvaluationFunction } from '.'
import {
	ASTNode,
	ConstantNode,
	EvaluatedNode,
	Evaluation,
	NodeKind,
} from './AST/types'
import { warning } from './error'
import { convertNodeToUnit } from './nodeUnits'
import parse from './parse'

export const collectNodeMissing = (
	node: EvaluatedNode | ASTNode
): Record<string, number> =>
	'missingVariables' in node ? node.missingVariables : {}

export const bonus = (missings: Record<string, number> = {}) =>
	Object.fromEntries(
		Object.entries(missings).map(([key, value]) => [key, value + 0.0001])
	)
export const mergeMissing = (
	left: Record<string, number> | undefined = {},
	right: Record<string, number> | undefined = {}
): Record<string, number> =>
	Object.fromEntries(
		[...Object.keys(left), ...Object.keys(right)].map((key) => [
			key,
			(left[key] ?? 0) + (right[key] ?? 0),
		])
	)

export const mergeAllMissing = (missings: Array<EvaluatedNode | ASTNode>) =>
	missings.map(collectNodeMissing).reduce(mergeMissing, {})

function convertNodesToSameUnit(this: Engine, nodes, mecanismName) {
	const firstNodeWithUnit = nodes.find((node) => !!node.unit)
	if (!firstNodeWithUnit) {
		return nodes
	}
	return nodes.map((node) => {
		try {
			return convertNodeToUnit(firstNodeWithUnit.unit, node)
		} catch (e) {
			warning(
				this.options.logger,
				this.cache._meta.evaluationRuleStack[0],
				`Les unités des éléments suivants sont incompatibles entre elles : \n\t\t${
					node?.name || node?.rawNode
				}\n\t\t${firstNodeWithUnit?.name || firstNodeWithUnit?.rawNode}'`,
				e
			)
			return node
		}
	})
}

export const evaluateArray: <NodeName extends NodeKind>(
	reducer,
	start
) => EvaluationFunction<NodeName> = (reducer, start) =>
	function (node: any) {
		const evaluate = this.evaluate.bind(this)
		const evaluatedNodes = convertNodesToSameUnit.call(
			this,
			node.explanation.map(evaluate),
			node.name
		)
		const values = evaluatedNodes.map(({ nodeValue }) => nodeValue)
		const nodeValue = values.some((value) => value === null)
			? null
			: values.reduce(reducer, start)

		return {
			...node,
			missingVariables: mergeAllMissing(evaluatedNodes),
			explanation: evaluatedNodes,
			...(evaluatedNodes[0] && { unit: evaluatedNodes[0].unit }),
			nodeValue,
		}
	}

export const defaultNode = (nodeValue: Evaluation) =>
	({
		nodeValue,
		type: typeof nodeValue,
		isDefault: true,
		nodeKind: 'constant',
	} as ConstantNode)

export const parseObject = (objectShape, value, context) => {
	return Object.fromEntries(
		Object.entries(objectShape).map(([key, defaultValue]) => {
			if (value[key] == null && !defaultValue) {
				throw new Error(
					`Il manque une clé '${key}' dans ${JSON.stringify(value)} `
				)
			}

			const parsedValue =
				value[key] != null ? parse(value[key], context) : defaultValue
			return [key, parsedValue]
		})
	)
}
