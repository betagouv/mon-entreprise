import { bonus, evaluateNode, mergeMissing } from 'Engine/evaluation'
import { map, mergeAll, pick, pipe } from 'ramda'
import { anyNull, undefOrTrue, val } from './traverse-common-functions'

export const evaluateApplicability = (
	cache,
	situationGate,
	parsedRules,
	node
) => {
	let evaluatedAttributes = pipe(
			pick([
				'parentDependency',
				'non applicable si',
				'applicable si',
				'rendu non applicable'
			]),
			map(value => evaluateNode(cache, situationGate, parsedRules, value))
		)(node),
		{
			parentDependency,
			'non applicable si': notApplicable,
			'applicable si': applicable,
			'rendu non applicable': disabled
		} = evaluatedAttributes,
		isApplicable =
			val(parentDependency) === false ||
			val(notApplicable) === true ||
			val(applicable) === false ||
			val(disabled) === true
				? false
				: anyNull([notApplicable, applicable, parentDependency])
				? null
				: !val(notApplicable) && undefOrTrue(val(applicable)),
		missingVariables =
			isApplicable === false
				? {}
				: mergeAll([
						parentDependency?.missingVariables || {},
						notApplicable?.missingVariables || {},
						applicable?.missingVariables || {}
				  ])
	return {
		nodeValue: isApplicable,
		missingVariables,
		...evaluatedAttributes,
		inactiveParent: parentDependency && val(parentDependency) == false
	}
}

export default (cache, situationGate, parsedRules, node) => {
	cache.parseLevel++
	let applicabilityEvaluation = evaluateApplicability(
			cache,
			situationGate,
			parsedRules,
			node
		),
		{
			missingVariables: condMissing,
			nodeValue: isApplicable
		} = applicabilityEvaluation,
		evaluateFormula = () =>
			node.formule
				? evaluateNode(cache, situationGate, parsedRules, node.formule)
				: {},
		// evaluate the formula lazily, only if the applicability is known and true
		evaluatedFormula = isApplicable
			? evaluateFormula()
			: isApplicable === false
			? {
					...node.formule,
					missingVariables: {},
					nodeValue: 0
			  }
			: {
					...node.formule,
					missingVariables: {},
					nodeValue: null
			  },
		{ missingVariables: formulaMissingVariables, nodeValue } = evaluatedFormula,
		missingVariables = mergeMissing(
			bonus(condMissing, !!Object.keys(condMissing).length),
			formulaMissingVariables
		)
	cache.parseLevel--

	return {
		...node,
		...applicabilityEvaluation,
		...{ formule: evaluatedFormula },
		nodeValue,
		isApplicable,
		missingVariables
	}
}
