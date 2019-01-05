import { isNil } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { Rules } from './BooleanEngine'
import { evaluateNode, makeJsx, mergeMissing } from './evaluation'
import { Leaf, Node } from './mecanismViews/common'
import {
	disambiguateRuleReference,
	findParentDependency,
	findRuleByDottedName
} from './rules'
import { getSituationValue } from './variables'

export let treatVariable = (
	rules,
	rule,
	booleanEngine,
	filter
) => parseResult => {
	let evaluate = (cache, situation, parsedRules, node) => {
		let dottedName = node.dottedName,
			// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
			// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
			cacheName = dottedName + (filter ? '.' + filter : ''),
			cached = cache[cacheName]

		if (cached) return cached

		let variable = findRuleByDottedName(parsedRules, dottedName),
			situationValue = getSituationValue(situation, dottedName, variable),
			variableHasCond =
				variable['applicable si'] != null ||
				variable['non applicable si'] != null ||
				findParentDependency(rules, variable),
			needsEvaluation = isNil(situationValue) || variableHasCond

		let explanation = variable
		// We fill the cache in order to prevent infinite loop with circular dependancies
		cache[cacheName] = explanation
		if (needsEvaluation) {
			explanation = evaluateNode(cache, situation, parsedRules, variable)
		}

		const missingVariables = mergeMissing(
			explanation.missingVariables,
			isNil(situationValue) &&
				explanation.isApplicable !== false &&
				((variable.question && isNil(explanation.nodeValue)) ||
					!variable.formule) && { [dottedName]: 1 }
		)

		let nodeValue =
			!isNil(situationValue) && explanation.isApplicable != false
				? situationValue
				: !isNil(explanation.nodeValue)
				? explanation.nodeValue
				: null

		if (
			[true, false].includes(nodeValue) &&
			explanation.isApplicable &&
			typeof situationValue === 'boolean'
		) {
			booleanEngine.addRule(
				situationValue
					? new Rules.True(dottedName)
					: new Rules.False(dottedName)
			)
		}

		cache[cacheName] = { ...node, nodeValue, explanation, missingVariables }
		return cache[cacheName]
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
export let treatVariableTransforms = (
	rules,
	rule,
	booleanEngine
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

		return {
			...filteredNode,
			periodTransform,
			nodeValue: transformedNodeValue,
			...(periodTransform ? { originPeriodValue: nodeValue } : {})
		}
	}
	let node = treatVariable(rules, rule, booleanEngine, parseResult.filter)(
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

		return { ...node, nodeValue, explanation, missingVariables }
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
