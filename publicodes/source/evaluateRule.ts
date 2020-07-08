import { typeWarning } from './error'
import {
	bonus,
	evaluateNode,
	mergeMissing,
	mergeAllMissing
} from './evaluation'
import { convertNodeToUnit } from './nodeUnits'
import { ParsedRule, EvaluatedNode } from './types'

type ApplicabilityWithMissings = {
	isApplicable: boolean
	missingVariables: EvaluatedNode['missingVariables']
}

type ApplicabilityAttribute =
	| 'non applicable si'
	| 'applicable si'
	| 'rendu non applicable'

export function evaluateApplicability(
	cache,
	situation,
	parsedRules,
	node: ParsedRule
): ApplicabilityWithMissings {
	const parentsApplicability = node.parentDependencies?.map(parentNode =>
		evaluateApplicability(cache, situation, parsedRules, parentNode)
	)
	if (node.dottedName === 'x . y') {
		console.log(node.parentDependencies)
	}
	const notApplicableParent = parentsApplicability?.find(
		({ isApplicable }) => isApplicable === false
	)
	return (
		notApplicableParent ??
		evaluateApplicabilityAttributes(cache, situation, parsedRules, node)
	)
}

function evaluateApplicabilityAttributes(
	cache,
	situation,
	parsedRules,
	node: ParsedRule
): ApplicabilityWithMissings {
	const evaluateAttribute = (attributeName: ApplicabilityAttribute) =>
		node?.[attributeName] &&
		evaluateNode(cache, situation, parsedRules, node[attributeName])
	const notApplicableAttribute = evaluateAttribute('non applicable si')
	const applicableAttribute = evaluateAttribute('applicable si')
	const disabledAttribute = evaluateAttribute('rendu non applicable')

	for (const [attribute, notApplicableValue] of [
		[notApplicableAttribute, true],
		[applicableAttribute, false],
		[disabledAttribute, true]
	]) {
		if (attribute?.nodeValue === notApplicableValue) {
			return {
				isApplicable: false,
				missingVariables: attribute.missingVariables
			}
		}
	}

	return {
		isApplicable: true,
		missingVariables: mergeAllMissing(
			[notApplicableAttribute, applicableAttribute, disabledAttribute].filter(
				Boolean
			)
		)
	}
}

export default function evaluateRule(cache, situation, parsedRules, node) {
	cache._meta.contextRule.push(node.dottedName)
	const { missingVariables: condMissing, isApplicable } = evaluateApplicability(
		cache,
		situation,
		parsedRules,
		node
	)

	// evaluate the formula lazily, only if the applicability is known and true
	let evaluatedFormula =
		isApplicable && node.formule
			? evaluateNode(cache, situation, parsedRules, node.formule)
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
	cache._meta.contextRule.pop()
	return {
		...node,
		...(node.formule && { formule: evaluatedFormula }),
		nodeValue: evaluatedFormula.nodeValue,
		unit: node.unit ?? evaluatedFormula.unit,
		temporalValue,
		isApplicable,
		missingVariables
	}
}
