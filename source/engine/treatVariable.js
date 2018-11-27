import React from 'react'
import { Node, Leaf } from './mecanismViews/common'
import {
	findRuleByDottedName,
	disambiguateRuleReference,
	findParentDependency
} from './rules'
import { evaluateNode, rewriteNode, makeJsx } from './evaluation'
import { getSituationValue } from './variables'
import { Trans } from 'react-i18next'

export let treatVariable = (rules, rule, filter) => parseResult => {
	let evaluate = (cache, situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
			// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
			cacheName = dottedName + (filter ? '.' + filter : ''),
			cached = cache[cacheName]

		if (cached) return cached
		let variable = findRuleByDottedName(parsedRules, dottedName),
			variableHasFormula = variable.formule != null,
			variableHasCond =
				variable['applicable si'] != null ||
				variable['non applicable si'] != null,
			situationValue = getSituationValue(situation, dottedName, variable),
			needsEvaluation =
				situationValue == null &&
				(variableHasCond ||
					variableHasFormula ||
					findParentDependency(rules, variable))

		//		if (dottedName.includes('jeune va')) debugger

		let explanation = needsEvaluation
			? evaluateNode(cache, situation, parsedRules, variable)
			: variable

		let cacheAndNode = (nodeValue, missingVariables) => {
			cache[cacheName] = rewriteNode(
				node,
				nodeValue,
				explanation,
				missingVariables
			)
			return cache[cacheName]
		}

		// SITUATION 1 : La variable est directement renseignée
		if (situationValue != null) return cacheAndNode(situationValue, {})

		// SITUATION 2 : La variable est calculée
		if (situationValue == null && variableHasFormula)
			return cacheAndNode(explanation.nodeValue, explanation.missingVariables)

		// SITUATION 3 : La variable est une question sans condition dont la valeur n'a pas été renseignée
		if (situationValue == null && !variableHasFormula && !variableHasCond)
			return cacheAndNode(null, { [dottedName]: 1 })

		// SITUATION 4 : La variable est une question avec conditions
		if (situationValue == null && !variableHasFormula && variableHasCond) {
			// SITUATION 4.1 : La condition est connue et vrai
			if (explanation.isApplicable)
				return variable.question
					? cacheAndNode(null, { [dottedName]: 1 })
					: cacheAndNode(true, {})

			// SITUATION 4.2 : La condition est connue et fausse
			if (explanation.isApplicable === false) return cacheAndNode(false, {})
			// SITUATION 4.3 : La condition n'est pas connue
			if (explanation.isApplicable == null)
				return cacheAndNode(null, {
					...explanation.missingVariables,
					...(variable.question ? { [dottedName]: 1 } : {})
				})
		}
	}

	let { fragments } = parseResult,
		variablePartialName = fragments.join(' . '),
		dottedName = disambiguateRuleReference(rules, rule, variablePartialName)

	return {
		evaluate,
		//eslint-disable-next-line react/display-name
		jsx: nodeValue => (
			<Leaf
				classes="variable filtered"
				filter={filter}
				name={fragments.join(' . ')}
				dottedName={dottedName}
				value={nodeValue}
			/>
		),

		name: variablePartialName,
		category: 'variable',
		fragments,
		dottedName
	}
}

// This function is a wrapper that can apply :
// - temporal transformations to the value of the variable.
// See the période.yaml test suite for details
// - filters on the variable to select one part of the variable's 'composantes'

// TODO - the implementations of filters is really bad. It injects a hack in the situation to make the composante mecanism compute only one of its branch. It is then stored in the cache under a new key, dottedName.filter. This mecanism should just query the variable tree to get the active composante's value...
export let treatVariableTransforms = (rules, rule) => parseResult => {
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
		if (nodeValue == null) return filteredNode
		let ruleToTransform = findRuleByDottedName(
			rules,
			filteredNode.explanation.dottedName
		)

		let inlinePeriodTransform = { mensuel: 'mois', annuel: 'année' }[
			parseResult.temporalTransform
		]

		// Exceptions
		if (!rule.période && !inlinePeriodTransform) {
			if (
				ruleToTransform.période == 'flexible' &&
				!cache.checkingParentDependencies.includes(rule.dottedName)
			)
				throw new Error(
					`Attention, une variable sans période, ${
						rule.dottedName
					}, qui appelle une variable à période flexible, ${
						ruleToTransform.dottedName
					}, c'est suspect ! 
				`
				)

			return filteredNode
		}
		if (!ruleToTransform.période) return filteredNode

		let environmentPeriod = situation('période') || 'mois'
		let callingPeriod =
			inlinePeriodTransform ||
			(rule.période == 'flexible' ? environmentPeriod : rule.période)
		let calledPeriod =
			ruleToTransform.période == 'flexible'
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
	let node = treatVariable(rules, rule, parseResult.filter)(
		parseResult.variable || parseResult
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

export let treatNegatedVariable = variable => {
	let evaluate = (cache, situation, parsedRules, node) => {
		let explanation = evaluateNode(
				cache,
				situation,
				parsedRules,
				node.explanation
			),
			nodeValue = explanation.nodeValue == null ? null : !explanation.nodeValue,
			missingVariables = explanation.missingVariables

		return rewriteNode(node, nodeValue, explanation, missingVariables)
	}

	let jsx = (nodeValue, explanation) => (
		<Node
			classes="inlineExpression negation"
			value={nodeValue}
			child={
				<span className="nodeContent">
					<Trans i18nKey="inlineExpressionNegation">Non</Trans>{' '}
					{makeJsx(explanation)}
				</span>
			}
		/>
	)

	return {
		evaluate,
		jsx,
		category: 'mecanism',
		name: 'négation',
		type: 'boolean',
		explanation: variable
	}
}
