import { EvaluationFunction } from '..'
import { ASTNode, Unit } from '../AST/types'
import { warning } from '../error'
import { bonus, defaultNode, mergeAllMissing } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit } from '../nodeUnits'
import parse from '../parse'
import {
	liftTemporal2,
	pureTemporal,
	sometime,
	Temporal,
	temporalAverage,
} from '../temporal'

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
	const [temporalValue, explanation, unit] = node.explanation.reduce<
		[
			Temporal<any>,
			VariationNode['explanation'],
			Unit | undefined,
			Temporal<any>
		]
	>(
		(
			[evaluation, explanations, unit, previousConditions],
			{ condition, consequence },
			i: number
		) => {
			const previousConditionsAlwaysTrue = !sometime(
				(value) => value !== true,
				previousConditions
			)
			if (previousConditionsAlwaysTrue) {
				return [
					evaluation,
					[...explanations, { condition, consequence }],
					unit,
					previousConditions,
				]
			}
			const evaluatedCondition = this.evaluate(condition)
			const currentCondition = liftTemporal2(
				(previousCond, currentCond) =>
					previousCond === null
						? previousCond
						: !previousCond &&
						  (currentCond === null ? null : currentCond !== false),
				previousConditions,
				evaluatedCondition.temporalValue ??
					pureTemporal(evaluatedCondition.nodeValue)
			)
			evaluatedCondition.missingVariables = bonus(
				evaluatedCondition.missingVariables
			)
			const currentConditionAlwaysFalse = !sometime(
				(x) => x !== false,
				currentCondition
			)
			if (currentConditionAlwaysFalse) {
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
						this.cache._meta.ruleStack[0],
						`L'unité de la branche n° ${
							i + 1
						} du mécanisme 'variations' n'est pas compatible avec celle d'une branche précédente`,
						e
					)
				}
			}
			const currentValue = liftTemporal2(
				(cond, value) => cond && value,
				currentCondition,
				evaluatedConsequence.temporalValue ??
					pureTemporal(evaluatedConsequence.nodeValue)
			)
			const or = (a, b) => a || b
			return [
				liftTemporal2(or, evaluation, currentValue),
				[
					...explanations,
					{
						condition: evaluatedCondition,
						satisfied: evaluatedCondition.nodeValue !== false,
						consequence: evaluatedConsequence,
					},
				],
				unit || evaluatedConsequence.unit,
				liftTemporal2(or, previousConditions, currentCondition),
			]
		},
		[pureTemporal(false), [], undefined, pureTemporal(false)]
	)

	const nodeValue = temporalAverage(temporalValue, unit)
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
		...(temporalValue.length > 1 && { temporalValue }),
	}
}

registerEvaluationFunction('variations', evaluate)
