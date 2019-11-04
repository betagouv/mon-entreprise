// Reference to a variable
import parseRule from 'Engine/parseRule';
import React from 'react';
import { evaluateApplicability } from './evaluateRule';
import { evaluateNode } from './evaluation';
import { getSituationValue } from './getSituationValue';
import { Leaf } from './mecanismViews/common';
import { disambiguateRuleReference, findParentDependency, findRuleByDottedName } from './rules';

const ruleHasConditions = (rule, rules) =>
	rule['applicable si'] != null ||
		rule['non applicable si'] != null ||
		rule.isDisabledBy ?.length > 1 ||
		findParentDependency(rules, rule)

let evaluateReference = (filter) => (cache, situation, rules, node) => {
	let rule = rules[node.dottedName]


	// When a rule exists in different version (created using the `replace` mecanism), we add
	// a redirection in the evaluation of references to use a potential active replacement
	const applicableReplacements = rule.replacedBy
		.filter(({ referenceNode }) => {
			const isApplicable =
				!ruleHasConditions(rules[referenceNode.dottedName], rules) ||
				evaluateApplicability(cache, situation, rules, rules[referenceNode.dottedName]).nodeValue === true
			return isApplicable
		}
		)
		.map(({ referenceNode, replacementNode }) =>
			replacementNode != null ? evaluateNode(cache, situation, rules, replacementNode) : evaluateReference(filter)(cache, situation, rules, referenceNode)
		)

	if (applicableReplacements.length) {
		return applicableReplacements[0]
	}


	let dottedName = node.dottedName,
		// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
		// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
		cacheName = dottedName + (filter ? '.' + filter : ''),
		cached = cache[cacheName]
	if (cached) return cached


	let variableHasFormula = rule.formule != null,
		variableHasCond = ruleHasConditions(rule, rules),
		situationValue = getSituationValue(situation, dottedName, rule),

		needsEvaluation =
			situationValue == null && (variableHasCond || variableHasFormula)

	let explanation = needsEvaluation
		? evaluateNode(cache, situation, rules, rule)
		: rule

	let cacheAndNode = (nodeValue, missingVariables, customExplanation) => {
		cache[cacheName] = {
			...node,
			nodeValue,
			explanation: customExplanation || explanation,
			missingVariables
		}
		return cache[cacheName]
	}
	const variableScore = rule.defaultValue ? 1 : 2

	// SITUATION 1 : La variable est directement renseignée
	if (situationValue != null) {
		return cacheAndNode(
			situationValue,
			{},
			{ ...explanation, nodeValue: situationValue }
		)
	}

	// SITUATION 2 : La variable est calculée
	if (situationValue == null && variableHasFormula)
		return cacheAndNode(explanation.nodeValue, explanation.missingVariables)

	// SITUATION 3 : La variable est une question sans condition dont la valeur n'a pas été renseignée
	if (situationValue == null && !variableHasFormula && !variableHasCond)
		return cacheAndNode(null, { [dottedName]: variableScore })

	// SITUATION 4 : La variable est une question avec conditions
	if (situationValue == null && !variableHasFormula && variableHasCond) {
		// SITUATION 4.1 : La condition est connue et vrai
		if (explanation.isApplicable)
			return rule.question
				? cacheAndNode(null, { [dottedName]: variableScore })
				: cacheAndNode(true, {})

		// SITUATION 4.2 : La condition est connue et fausse
		if (explanation.isApplicable === false) return cacheAndNode(false, {})

		// SITUATION 4.3 : La condition n'est pas connue
		return cacheAndNode(null, explanation.missingVariables)
	}
}
export let parseReference = (rules, rule, parsedRules, filter) => (
	partialReference
) => {
	let dottedName = disambiguateRuleReference(rules, rule, partialReference)

	let inInversionFormula = rule.formule ?.['inversion numérique']

	let parsedRule =
		parsedRules[dottedName] ||
		// the 'inversion numérique' formula should not exist. The instructions to the evaluation should be enough to infer that an inversion is necessary (assuming it is possible, the client decides this)
		(!inInversionFormula &&
			parseRule(rules, findRuleByDottedName(rules, dottedName), parsedRules))


	return {
		evaluate: evaluateReference(filter, parsedRule),
		//eslint-disable-next-line react/display-name
		jsx: nodeValue => (
			<>
				<Leaf
					classes="variable filtered"
					filter={filter}
					name={partialReference}
					dottedName={dottedName}
					nodeValue={nodeValue}
					unit={parsedRule.unit}
				/>
			</>
		),

		name: partialReference,
		category: 'reference',
		partialReference,
		dottedName,
		unit: parsedRule.unit
	}
}

// This function is a wrapper that can apply :
// - temporal transformations to the value of the variable.
// See the période.yaml test suite for details
// - filters on the variable to select one part of the variable's 'composantes'

const evaluateTransforms = (originalEval, rule, parseResult) => (
	cache,
	situation,
	parsedRules,
	node
) => {



	// Filter transformation
	let filteringSituation = name =>
		name == 'sys.filter' ? parseResult.filter : situation(name)
	let filteredNode = originalEval(
		cache,
		parseResult.filter ? filteringSituation : situation,
		parsedRules,
		node
	)
	if (!filteredNode.explanation) {
		return filteredNode
	}

	let nodeValue = filteredNode.nodeValue

	// Temporal transformation
	let supportedPeriods = ['mois', 'année', 'flexible']
	if (nodeValue == null) return filteredNode
	let ruleToTransform = findRuleByDottedName(
		parsedRules,
		filteredNode.explanation.dottedName
	)

	let inlinePeriodTransform = { mensuel: 'mois', annuel: 'année' }[
		parseResult.temporalTransform
	]

	// Exceptions
	if (!rule.période && !inlinePeriodTransform) {
		if (supportedPeriods.includes(ruleToTransform.période))
			throw new Error(
				`Attention, une variable sans période, ${rule.dottedName}, qui appelle une variable à période, ${ruleToTransform.dottedName}, c'est suspect !

				Si la période de la variable appelée est neutralisée dans la formule de calcul, par exemple un montant mensuel divisé par 30 (comprendre 30 jours), utilisez "période: aucune" pour taire cette erreur et rassurer tout le monde.
			`
			)

		return filteredNode
	}
	if (!ruleToTransform.période) return filteredNode
	let environmentPeriod = situation('période') || 'mois'
	let callingPeriod =
		inlinePeriodTransform ||
		(rule.période === 'flexible' ? environmentPeriod : rule.période)
	let calledPeriod =
		ruleToTransform.période === 'flexible'
			? environmentPeriod
			: ruleToTransform.période

	let transformedNodeValue =
		callingPeriod === 'mois' && calledPeriod === 'année'
			? nodeValue / 12
			: callingPeriod === 'année' && calledPeriod === 'mois'
				? nodeValue * 12
				: nodeValue,
		periodTransform = nodeValue !== transformedNodeValue

	let result = {
		...filteredNode,
		periodTransform,
		...(periodTransform ? { originPeriodValue: nodeValue } : {}),
		nodeValue: transformedNodeValue,
		explanation: filteredNode.explanation,
		missingVariables: filteredNode.missingVariables
	}

	return result
}
export let parseReferenceTransforms = (
	rules,
	rule,
	parsedRules
) => parseResult => {
	const referenceName = parseResult.variable.fragments.join(' . ')
	let node = parseReference(rules, rule, parsedRules, parseResult.filter)(
		referenceName
	)

	return {
		...node,
		// Decorate node with the composante filter (either who is paying, either tax free)
		...(parseResult.filter
			? {
				cotisation: {
					...node.cotisation,
					'dû par': parseResult.filter,
					'impôt sur le revenu': parseResult.filter
				}
			}
			: {}),
		evaluate: evaluateTransforms(node.evaluate, rule, parseResult)
	}
}
