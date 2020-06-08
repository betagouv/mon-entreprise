import { or } from 'ramda'
import Variations from '../components/mecanisms/Variations'
import { typeWarning } from '../error'
import { bonus, defaultNode, evaluateNode } from '../evaluation'
import { convertNodeToUnit } from '../nodeUnits'
import {
	liftTemporal2,
	pureTemporal,
	sometime,
	temporalAverage
} from '../temporal'
import { inferUnit } from '../units'
import { mergeAllMissing } from './../evaluation'

export default function parse(recurse, v) {
	const explanation = v.map(({ si, alors, sinon }) =>
		sinon !== undefined
			? { consequence: recurse(sinon), condition: defaultNode(true) }
			: { consequence: recurse(alors), condition: recurse(si) }
	)

	// TODO - find an appropriate representation
	return {
		explanation,
		evaluate,
		jsx: Variations,
		category: 'mecanism',
		name: 'variations',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(r => r.consequence.unit)
		)
	}
}

export function devariate(recurse, k, v) {
	const explanation = devariateExplanation(recurse, k, v)
	return {
		explanation,
		evaluate,
		jsx: Variations,
		category: 'mecanism',
		name: 'variations',
		type: 'numeric',
		unit: inferUnit(
			'+',
			explanation.map(r => r.consequence.unit)
		)
	}
}

type Variation =
	| {
			si: any
			alors: object
	  }
	| {
			sinon: object
	  }
const devariateExplanation = (
	recurse,
	mecanismKey,
	v: { variations: Array<Variation> }
) => {
	const { variations, ...fixedProps } = v
	const explanation = variations.map(variation => ({
		condition: 'sinon' in variation ? defaultNode(true) : recurse(variation.si),
		consequence: recurse({
			[mecanismKey]: {
				...fixedProps,
				...('sinon' in variation ? variation.sinon : variation.alors)
			}
		})
	}))

	return explanation
}

function evaluate(
	cache,
	situation,
	parsedRules,
	node: ReturnType<typeof parse>
) {
	const evaluate = evaluateNode.bind(null, cache, situation, parsedRules)

	const [temporalValue, explanation, unit] = node.explanation.reduce(
		(
			[evaluation, explanations, unit, previousConditions],
			{ condition, consequence },
			i: number
		) => {
			const previousConditionsAlwaysTrue = !sometime(
				value => value !== true,
				previousConditions
			)
			if (previousConditionsAlwaysTrue) {
				return [
					evaluation,
					[...explanations, { condition, consequence }],
					unit,
					previousConditions
				]
			}
			const evaluatedCondition = evaluate(condition)
			const currentCondition = liftTemporal2(
				(previousCond, currentCond) =>
					previousCond === null ? previousCond : !previousCond && currentCond,
				previousConditions,
				evaluatedCondition.temporalValue ??
					pureTemporal(evaluatedCondition.nodeValue)
			)
			evaluatedCondition.missingVariables = bonus(
				evaluatedCondition.missingVariables,
				true
			)
			const currentConditionAlwaysFalse = !sometime(
				x => x !== false,
				currentCondition
			)
			if (currentConditionAlwaysFalse) {
				return [
					evaluation,
					[...explanations, { condition: evaluatedCondition, consequence }],
					unit,
					previousConditions
				]
			}
			let evaluatedConsequence = evaluate(consequence)

			try {
				evaluatedConsequence = convertNodeToUnit(unit, evaluatedConsequence)
			} catch (e) {
				return typeWarning(
					cache._meta.contexRule,
					`L'unité de la branche n° ${i} du mécanisme 'variations' n'est pas compatible avec celle d'une branche précédente`,
					e
				)
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
						consequence: evaluatedConsequence
					}
				],
				unit || evaluatedConsequence.unit,
				liftTemporal2(or, previousConditions, currentCondition)
			]
		},
		[pureTemporal(false), [], node.unit, pureTemporal(false)]
	)

	const nodeValue = temporalAverage(temporalValue, unit)
	const missingVariables = mergeAllMissing(
		explanation.reduce(
			(values, { condition, consequence }) => [
				...values,
				condition,
				consequence
			],
			[]
		)
	)
	return {
		...node,
		nodeValue,
		unit,
		explanation,
		missingVariables,
		...(temporalValue.length > 1 && { temporalValue })
	}
}
