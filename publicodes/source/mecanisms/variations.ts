import { or } from 'ramda'
import { EvaluationFunction } from '..'
import Variations from '../components/mecanisms/Variations'
import { ASTNode, EvaluatedNode, Unit } from '../AST/types'
import { typeWarning } from '../error'
import { bonus, defaultNode } from '../evaluation'
import { registerEvaluationFunction } from '../evaluationFunctions'
import { convertNodeToUnit, simplifyNodeUnit } from '../nodeUnits'
import parse from '../parse'
import {
	liftTemporal2,
	pureTemporal,
	sometime,
	Temporal,
	temporalAverage,
} from '../temporal'
import { mergeAllMissing } from './../evaluation'

export type VariationNode = {
	explanation: Array<{
		condition: ASTNode
		consequence: ASTNode
		satisfied?: boolean
	}>
	nodeKind: 'variations'
	jsx: (n: any) => unknown
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
		jsx: Variations,
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
			const evaluatedCondition = this.evaluateNode(condition)
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
				evaluatedCondition.missingVariables,
				true
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
			let evaluatedConsequence = this.evaluateNode(consequence)
			if (unit) {
				try {
					evaluatedConsequence = convertNodeToUnit(unit, evaluatedConsequence)
				} catch (e) {
					typeWarning(
						this.cache._meta.contextRule,
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
			return [
				liftTemporal2(or, evaluation, currentValue),
				[
					...explanations,
					{
						condition: evaluatedCondition,
						satisfied: !!evaluatedCondition.nodeValue,
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
