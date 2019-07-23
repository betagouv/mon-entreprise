import { inferUnit } from 'Engine/units'
import {
	bonus,
	collectNodeMissing,
	evaluateNode,
	mergeAllMissing,
	mergeMissing,
	rewriteNode
} from 'Engine/evaluation'
import { reject, pluck, isNil, filter, dissoc, reduce } from 'ramda'
import Variations from 'Engine/mecanismViews/Variations'

/* @devariate = true => This function will produce variations of a same mecanism (e.g. product) that share some common properties */
export default (recurse, k, v, devariate) => {
	let explanation = devariate
		? devariateExplanation(recurse, k, v)
		: v.map(({ si, alors, sinon }) =>
				sinon !== undefined
					? { consequence: recurse(sinon), condition: undefined }
					: { consequence: recurse(alors), condition: recurse(si) }
		  )

	let evaluate = (cache, situationGate, parsedRules, node) => {
		let evaluateVariationProp = prop =>
				prop && evaluateNode(cache, situationGate, parsedRules, prop),
			// mark the satisfied variation if any in the explanation
			[, resolvedExplanation] = reduce(
				([resolved, result], variation) => {
					if (resolved) return [true, [...result, variation]]

					// evaluate the condition
					let evaluatedCondition = evaluateVariationProp(variation.condition)

					if (evaluatedCondition == undefined) {
						// No condition : we've reached the eventual defaut case
						let evaluatedVariation = {
							consequence: evaluateVariationProp(variation.consequence),
							satisfied: true
						}
						return [true, [...result, evaluatedVariation]]
					}

					if (evaluatedCondition.nodeValue === null)
						// the current variation case has missing variables => we can't go further
						return [
							true,
							[...result, { ...variation, condition: evaluatedCondition }]
						]

					if (evaluatedCondition.nodeValue === true) {
						let evaluatedVariation = {
							condition: evaluatedCondition,
							consequence: evaluateVariationProp(variation.consequence),
							satisfied: true
						}
						return [true, [...result, evaluatedVariation]]
					}
					return [false, [...result, variation]]
				},
				[false, []]
			)(node.explanation),
			satisfiedVariation = resolvedExplanation.find(v => v.satisfied),
			nodeValue = satisfiedVariation
				? satisfiedVariation.consequence.nodeValue
				: null

		let leftMissing = mergeAllMissing(
				reject(isNil, pluck('condition', resolvedExplanation))
			),
			candidateVariations = filter(
				node => !node.condition || node.condition.nodeValue !== false,
				resolvedExplanation
			),
			rightMissing = mergeAllMissing(
				reject(isNil, pluck('consequence', candidateVariations))
			),
			missingVariables = satisfiedVariation
				? collectNodeMissing(satisfiedVariation.consequence)
				: mergeMissing(bonus(leftMissing), rightMissing)

		return rewriteNode(node, nodeValue, resolvedExplanation, missingVariables)
	}

	// TODO - find an appropriate representation

	return {
		explanation,
		evaluate,
		jsx: Variations,
		category: 'mecanism',
		name: 'variations',
		type: 'numeric',
		unit: inferUnit('+', explanation.map(r => r.consequence.unit))
	}
}

export let devariateExplanation = (recurse, mecanismKey, v) => {
	let fixedProps = dissoc('variations')(v),
		explanation = v.variations.map(({ si, alors, sinon }) => ({
			consequence: recurse({
				[mecanismKey]: {
					...fixedProps,
					...(sinon || alors)
				}
			}),
			condition: sinon ? undefined : recurse(si)
		}))

	return explanation
}
