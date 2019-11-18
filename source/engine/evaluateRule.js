import { bonus, evaluateNode, mergeMissing } from 'Engine/evaluation'
import { map, mergeAll, pick, pipe } from 'ramda'
import { typeWarning } from './error'
import { convertNodeToUnit } from './nodeUnits'
import { anyNull, undefOrTruthy, val } from './traverse-common-functions'
import { areUnitConvertible } from './units'

export const evaluateApplicability = (
	cache,
	situationGate,
	parsedRules,
	node
) => {
	let evaluatedAttributes = pipe(
			pick(['non applicable si', 'applicable si', 'rendu non applicable']),
			map(value => evaluateNode(cache, situationGate, parsedRules, value))
		)(node),
		{
			'non applicable si': notApplicable,
			'applicable si': applicable,
			'rendu non applicable': disabled
		} = evaluatedAttributes,
		parentDependencies = node.parentDependencies.map(parent =>
			evaluateNode(cache, situationGate, parsedRules, parent)
		),
		isApplicable =
			parentDependencies.some(parent => val(parent) === false) ||
			val(notApplicable) === true ||
			val(applicable) === false ||
			val(disabled) === true
				? false
				: anyNull([notApplicable, applicable, ...parentDependencies])
				? null
				: !val(notApplicable) && undefOrTruthy(val(applicable)),
		missingVariables =
			isApplicable === false
				? {}
				: mergeAll([
						...parentDependencies.map(parent => parent.missingVariables),
						notApplicable?.missingVariables || {},
						disabled?.missingVariables || {},
						applicable?.missingVariables || {}
				  ])

	return {
		nodeValue: isApplicable,
		missingVariables,
		...evaluatedAttributes
	}
}

export default (cache, situationGate, parsedRules, node) => {
	cache._meta.contextRule.push(node.dottedName)
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
	const unit =
		node.unit ||
		(node.defaultUnit &&
			cache._meta.defaultUnits.find(unit =>
				areUnitConvertible(node.defaultUnit, unit)
			)) ||
		node.defaultUnit ||
		evaluatedFormula.unit

	if (unit) {
		try {
			nodeValue = convertNodeToUnit(unit, evaluatedFormula).nodeValue
		} catch (e) {
			typeWarning(
				node.dottedName,
				`L'unité de la règle est incompatible avec celle de sa formule`,
				e
			)
		}
	}

	cache._meta.contextRule.pop()
	return {
		...node,
		...applicabilityEvaluation,
		...(node.formule && { formule: evaluatedFormula }),
		nodeValue,
		unit,
		isApplicable,
		missingVariables
	}
}
