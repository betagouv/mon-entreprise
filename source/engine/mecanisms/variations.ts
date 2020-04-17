import { typeWarning } from 'Engine/error'
import { bonus, defaultNode, evaluateNode } from 'Engine/evaluation'
import Variations from 'Engine/mecanismViews/Variations'
import { convertNodeToUnit } from 'Engine/nodeUnits'
import {
	liftTemporal2,
	pureTemporal,
	sometime,
	temporalAverage
} from 'Engine/temporal'
import { inferUnit } from 'Engine/units'
import { or } from 'ramda'
import { mergeAllMissing } from './../evaluation'
import { parseUnit } from './../units'

/* @devariate = true => This function will produce variations of a same mecanism (e.g. product) that share some common properties */
export default function parse(recurse, k, v, devariate) {
	let explanation = devariate
		? devariateExplanation(recurse, k, v)
		: v.map(({ si, alors, sinon }) =>
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
		unit:
			inferUnit(
				'+',
				explanation.map(r => r.consequence.unit)
			) ?? parseUnit('')
	}
}
type Variation =
	| {
			si: any
			alors: Object
	  }
	| {
			sinon: Object
	  }
export let devariateExplanation = (
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
	situationGate,
	parsedRules,
	node: ReturnType<typeof parse>
) {
	const evaluate = evaluateNode.bind(null, cache, situationGate, parsedRules)

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
