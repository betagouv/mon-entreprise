import { EvaluationFunction } from '..'
import { ASTNode, EvaluatedNode, Unit } from '../AST/types'
import { warning } from '../error'
import { bonus, defaultNode, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'

export type VariationNode = {
	explanation: Array<{
		condition: ASTNode
		consequence: ASTNode
		satisfied?: boolean
	}>
	nodeKind: 'variations'
}

export const devariate = (k, v, context): ASTNode => {
	if (k === 'valeur') {
		return parse(v, context)
	}
	const { variations, ...factoredKeys } = v
	const explanation = parse(
		{
			variations: variations.map(({ alors, sinon, si }) => {
				const { attributs, ...otherKeys } = alors ?? sinon
				return {
					[alors !== undefined ? 'alors' : 'sinon']: {
						...attributs,
						[k]: {
							...factoredKeys,
							...otherKeys,
						},
					},
					...(si !== undefined && { si }),
				}
			}),
		},
		context
	)
	return explanation
}

export default function parseVariations(v, context): VariationNode {
	const explanation = v.map(({ si, alors, sinon }) =>
		sinon !== undefined
			? { consequence: parse(sinon, context), condition: defaultNode(true) }
			: { consequence: parse(alors, context), condition: parse(si, context) }
	)

	return {
		explanation,
		nodeKind: 'variations',
	}
}

const evaluate: EvaluationFunction<'variations'> = function (node) {
	const [nodeValue, explanation, unit] = node.explanation.reduce<
		[
			EvaluatedNode['nodeValue'],
			VariationNode['explanation'],
			Unit | undefined,
			boolean | null
		]
	>(
		(
			[evaluation, explanations, unit, previousConditions],
			{ condition, consequence },
			i: number
		) => {
			if (previousConditions === true) {
				return [
					evaluation,
					[...explanations, { condition, consequence }],
					unit,
					previousConditions,
				]
			}
			const evaluatedCondition = this.evaluate(condition)
			const currentCondition =
				previousConditions === null
					? previousConditions
					: !previousConditions &&
					  (evaluatedCondition.nodeValue === null
							? null
							: evaluatedCondition.nodeValue !== false)

			evaluatedCondition.missingVariables = bonus(
				evaluatedCondition.missingVariables
			)

			if (currentCondition === false) {
				return [
					evaluation,
					[...explanations, { condition: evaluatedCondition, consequence }],
					unit,
					previousConditions,
				]
			}
			let evaluatedConsequence = this.evaluate(consequence)
			if (unit) {
				try {
					evaluatedConsequence = convertNodeToUnit(unit, evaluatedConsequence)
				} catch (e) {
					warning(
						this.options.logger,
						this.cache._meta.evaluationRuleStack[0],
						`L'unité de la branche n° ${
							i + 1
						} du mécanisme 'variations' n'est pas compatible avec celle d'une branche précédente`,
						e
					)
				}
			}
			return [
				currentCondition && evaluatedConsequence.nodeValue,
				[
					...explanations,
					{
						condition: evaluatedCondition,
						satisfied: evaluatedCondition.nodeValue !== false,
						consequence: evaluatedConsequence,
					},
				],
				unit || evaluatedConsequence.unit,
				previousConditions || currentCondition,
			]
		},
		[false, [], undefined, false]
	)

	const missingVariables = mergeAllMissing(
		explanation.reduce<ASTNode[]>(
			(values, { condition, consequence }) => [
				...values,
				condition,
				consequence,
			],
			[]
		)
	)

	return {
		...node,
		nodeValue,
		...(unit !== undefined && { unit }),
		explanation,
		missingVariables,
	}
}

registerEvaluationFunction('variations', evaluate)
