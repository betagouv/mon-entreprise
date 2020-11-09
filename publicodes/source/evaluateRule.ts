import { map, pick, pipe } from 'ramda'
import { evaluationFunction } from '.'
import { typeWarning } from './error'
import { bonus, mergeAllMissing, mergeMissing } from './evaluation'
import { convertNodeToUnit } from './nodeUnits'

export const evaluateApplicability: evaluationFunction = function(node: any) {
	const cacheKey = `${node.dottedName} [applicability]`
	if (node.dottedName && this.cache[cacheKey]) {
		return this.cache[cacheKey]
	}
	const evaluatedAttributes = pipe(
			pick(['non applicable si', 'applicable si', 'rendu non applicable']) as (
				x: any
			) => any,
			map(value => this.evaluateNode(value))
		)(node) as any,
		{
			'non applicable si': notApplicable,
			'applicable si': applicable,
			'rendu non applicable': disabled
		} = evaluatedAttributes,
		parentDependencies = node.parentDependencies.map(parent =>
			this.evaluateNode(parent)
		)

	const anyDisabledParent = parentDependencies.find(
		parent => parent?.nodeValue === false
	)

	const { nodeValue, missingVariables = {} } = anyDisabledParent
		? anyDisabledParent
		: notApplicable?.nodeValue === true
		? {
				nodeValue: false,
				missingVariables: notApplicable.missingVariables
		  }
		: disabled?.nodeValue === true
		? { nodeValue: false }
		: applicable?.nodeValue === false
		? { nodeValue: false, missingVariables: applicable.missingVariables }
		: {
				nodeValue: [notApplicable, applicable, ...parentDependencies].some(
					n => n?.nodeValue === null
				)
					? null
					: !notApplicable?.nodeValue &&
					  (applicable?.nodeValue == undefined || !!applicable?.nodeValue),
				missingVariables: mergeAllMissing(
					[...parentDependencies, notApplicable, disabled, applicable].filter(
						Boolean
					)
				)
		  }

	const res = {
		...node,
		nodeValue,
		isApplicable: nodeValue,
		missingVariables,
		parentDependencies,
		...evaluatedAttributes
	}

	if (node.dottedName) {
		this.cache[cacheKey] = res
	}

	return res
}

export const evaluateFormula: evaluationFunction = function(node) {
	const explanation = this.evaluateNode(node.explanation)
	const { nodeValue, unit, missingVariables, temporalValue } = explanation

	return {
		...node,
		nodeValue,
		unit,
		missingVariables,
		explanation,
		temporalValue
	}
}

export const evaluateRule: evaluationFunction = function(node: any) {
	this.cache._meta.contextRule.push(node.dottedName)
	const applicabilityEvaluation = evaluateApplicability.call(this, node)
	const {
		missingVariables: condMissing,
		nodeValue: isApplicable
	} = applicabilityEvaluation

	// evaluate the formula lazily, only if the applicability is known and true
	let evaluatedFormula =
		isApplicable && node.formule
			? this.evaluateNode(node.formule)
			: node.formule

	if (node.unit) {
		try {
			evaluatedFormula = convertNodeToUnit(node.unit, evaluatedFormula)
		} catch (e) {
			typeWarning(
				node.dottedName,
				"L'unité de la règle est incompatible avec celle de sa formule",
				e
			)
		}
	}
	const missingVariables = mergeMissing(
		bonus(condMissing, !!Object.keys(condMissing).length),
		evaluatedFormula.missingVariables
	)

	const temporalValue = evaluatedFormula.temporalValue
	this.cache._meta.contextRule.pop()
	return {
		...node,
		...applicabilityEvaluation,
		...(node.formule && { formule: evaluatedFormula }),
		nodeValue: evaluatedFormula.nodeValue,
		unit: node.unit ?? evaluatedFormula.unit,
		temporalValue,
		isApplicable,
		missingVariables
	}
}

export const evaluateDisabledBy: evaluationFunction = function(node) {
	const isDisabledBy = node.explanation.isDisabledBy.map(disablerNode =>
		this.evaluateNode(disablerNode)
	)
	const nodeValue = isDisabledBy.some(
		x => x.nodeValue !== false && x.nodeValue !== null
	)
	const explanation = { ...node.explanation, isDisabledBy }
	return {
		...node,
		explanation,
		nodeValue,
		missingVariables: mergeAllMissing(isDisabledBy)
	}
}

export const evaluateCondition: evaluationFunction = function(node) {
	const explanation = this.evaluateNode(node.explanation)
	const nodeValue = explanation.nodeValue
	const missingVariables = explanation.missingVariables

	return { ...node, nodeValue, explanation, missingVariables }
}
