import { bonus, evaluateNode, mergeMissing } from 'Engine/evaluation'
import { map, mergeAll, pick, pipe } from 'ramda'
import { Rule } from 'Types/rule'
import { typeWarning } from './error'
import { convertNodeToUnit } from './nodeUnits'
import { areUnitConvertible } from './units'

export const evaluateApplicability = (
	cache,
	situationGate,
	parsedRules,
	node: Rule
) => {
	let evaluatedAttributes = pipe(
			pick(['non applicable si', 'applicable si', 'rendu non applicable']) as (
				x: any
			) => any,
			map(value => evaluateNode(cache, situationGate, parsedRules, value))
		)(node) as any,
		{
			'non applicable si': notApplicable,
			'applicable si': applicable,
			'rendu non applicable': disabled
		} = evaluatedAttributes,
		parentDependencies = node.parentDependencies.map(parent =>
			evaluateNode(cache, situationGate, parsedRules, parent)
		),
		isApplicable =
			parentDependencies.some(parent => parent?.nodeValue === false) ||
			notApplicable?.nodeValue === true ||
			applicable?.nodeValue === false ||
			disabled?.nodeValue === true
				? false
				: [notApplicable, applicable, ...parentDependencies].some(
						n => n?.nodeValue === null
				  )
				? null
				: !notApplicable?.nodeValue &&
				  (applicable?.nodeValue == undefined || !!applicable?.nodeValue),
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
	const applicabilityEvaluation = evaluateApplicability(
		cache,
		situationGate,
		parsedRules,
		node
	)
	const {
		missingVariables: condMissing,
		nodeValue: isApplicable
	} = applicabilityEvaluation

	const evaluateFormula = () =>
		node.formule
			? evaluateNode(cache, situationGate, parsedRules, node.formule)
			: {}
	// evaluate the formula lazily, only if the applicability is known and true
	const evaluatedFormula = isApplicable
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
		  }
	let {
		missingVariables: formulaMissingVariables,
		nodeValue
	} = evaluatedFormula
	const missingVariables = mergeMissing(
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
		period,
		isApplicable,
		missingVariables
	}
}
