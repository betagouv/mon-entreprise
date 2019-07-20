// Reference to a variable
import React from 'react'
import { Trans } from 'react-i18next'
import { evaluateNode, makeJsx, rewriteNode } from './evaluation'
import { Leaf, Node } from './mecanismViews/common'
import {
	disambiguateRuleReference,
	findParentDependency,
	findRuleByDottedName
} from './rules'
import { getSituationValue } from './getSituationValue'
import parseRule from 'Engine/parseRule'

export let parseReference = (rules, rule, parsedRules, filter) => ({
	fragments
}) => {
	let partialReference = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, partialReference)

	let inInversionFormula = rule.formule?.['inversion numérique']

	let parsedRule =
		parsedRules[dottedName] ||
		// the 'inversion numérique' formula should not exist. The instructions to the evaluation should be enough to infer that an inversion is necessary (assuming it is possible, the client decides this)
		(!inInversionFormula &&
			parseRule(rules, findRuleByDottedName(rules, dottedName), parsedRules))

	let evaluate = (cache, situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
			// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
			cacheName = dottedName + (filter ? '.' + filter : ''),
			cached = cache[cacheName]

		if (cached) return cached

		let variable =
				typeof parsedRule === 'object' ? parsedRule : parsedRules[dottedName],
			variableHasFormula = variable.formule != null,
			variableHasCond =
				variable['applicable si'] != null ||
				variable['non applicable si'] != null ||
				findParentDependency(parsedRules, variable),
			situationValue = getSituationValue(situation, dottedName, variable),
			needsEvaluation =
				situationValue == null && (variableHasCond || variableHasFormula)

		let explanation = needsEvaluation
			? evaluateNode(cache, situation, parsedRules, variable)
			: variable

		let cacheAndNode = (nodeValue, missingVariables, customExplanation) => {
			cache[cacheName] = rewriteNode(
				node,
				nodeValue,
				customExplanation || explanation,
				missingVariables
			)
			return cache[cacheName]
		}
		const variableScore = variable.defaultValue ? 1 : 2

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
				return variable.question
					? cacheAndNode(null, { [dottedName]: variableScore })
					: cacheAndNode(true, {})

			// SITUATION 4.2 : La condition est connue et fausse
			if (explanation.isApplicable === false) return cacheAndNode(false, {})

			// SITUATION 4.3 : La condition n'est pas connue
			return cacheAndNode(null, explanation.missingVariables)
		}
	}

	return {
		evaluate,
		//eslint-disable-next-line react/display-name
		jsx: nodeValue => (
			<>
				<Leaf
					classes="variable filtered"
					filter={filter}
					name={fragments.join(' . ')}
					dottedName={dottedName}
					nodeValue={nodeValue}
					unit={parsedRule.unit}
				/>
			</>
		),

		name: partialReference,
		category: 'reference',
		fragments,
		dottedName,
		unit: parsedRule.unit
	}
}

// This function is a wrapper that can apply :
// - temporal transformations to the value of the variable.
// See the période.yaml test suite for details
// - filters on the variable to select one part of the variable's 'composantes'

export let parseReferenceTransforms = (
	rules,
	rule,
	parsedRules
) => parseResult => {
	let evaluateTransforms = originalEval => (
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

		let result = rewriteNode(
			{
				...filteredNode,
				periodTransform: periodTransform,
				...(periodTransform ? { originPeriodValue: nodeValue } : {})
			},
			transformedNodeValue,
			filteredNode.explanation,
			filteredNode.missingVariables
		)

		return result
	}
	let node = parseReference(rules, rule, parsedRules, parseResult.filter)(
		parseResult.variable
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
		evaluate: evaluateTransforms(node.evaluate)
	}
}
