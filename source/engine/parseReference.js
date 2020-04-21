// Reference to a variable
import parseRule from 'Engine/parseRule'
import React from 'react'
import { typeWarning } from './error'
import { evaluateApplicability } from './evaluateRule'
import { evaluateNode, mergeMissing } from './evaluation'
import { getSituationValue } from './getSituationValue'
import { Leaf } from './mecanismViews/common'
import { convertNodeToUnit, getNodeDefaultUnit } from './nodeUnits'
import { disambiguateRuleReference } from './ruleUtils'
import { areUnitConvertible } from './units'
const getApplicableReplacements = (
	filter,
	contextRuleName,
	cache,
	situation,
	rules,
	rule
) => {
	let missingVariableList = []
	const applicableReplacements = rule.replacedBy
		.sort(
			(replacement1, replacement2) =>
				!!replacement2.whiteListedNames - !!replacement1.whiteListedNames
		)
		// Remove remplacement not in whitelist
		.filter(
			({ whiteListedNames }) =>
				!whiteListedNames ||
				whiteListedNames.some(name => contextRuleName.startsWith(name))
		)
		.filter(
			({ blackListedNames }) =>
				!blackListedNames ||
				blackListedNames.every(name => !contextRuleName.startsWith(name))
		)
		.filter(({ referenceNode }) => contextRuleName !== referenceNode.dottedName)
		// Remove remplacement defined in a not applicable node
		.filter(({ referenceNode }) => {
			const referenceRule = rules[referenceNode.dottedName]
			const {
				nodeValue: isApplicable,
				missingVariables
			} = evaluateApplicability(cache, situation, rules, referenceRule)
			missingVariableList.push(missingVariables)
			return isApplicable
		})
		// Remove remplacement defined in a node whose situation value is false
		.filter(({ referenceNode }) => {
			const referenceRule = rules[referenceNode.dottedName]
			const situationValue = getSituationValue(
				situation,
				referenceRule.dottedName,
				referenceRule
			)
			if (referenceNode.question && situationValue == null) {
				missingVariableList.push({ [referenceNode.dottedName]: 1 })
			}
			return situationValue !== false
		})
		// Remove remplacement defined in a boolean node whose evaluated value is false
		.filter(({ referenceNode }) => {
			const referenceRule = rules[referenceNode.dottedName]
			if (referenceRule.formule?.explanation?.operationType !== 'comparison') {
				return true
			}
			const { nodeValue: isApplicable, missingVariables } = evaluateNode(
				cache,
				situation,
				rules,
				referenceRule
			)
			missingVariableList.push(missingVariables)
			return isApplicable
		})
		.map(({ referenceNode, replacementNode }) =>
			replacementNode != null
				? evaluateNode(cache, situation, rules, replacementNode)
				: evaluateReference(filter)(cache, situation, rules, referenceNode)
		)
		.map(replacementNode => {
			const replacedRuleUnit = getNodeDefaultUnit(rule, cache)
			if (!areUnitConvertible(replacementNode.unit, replacedRuleUnit)) {
				typeWarning(
					contextRuleName,
					`L'unité de la règle de remplacement n'est pas compatible avec celle de la règle remplacée ${rule.dottedName}`
				)
			}
			return {
				...replacementNode,
				unit: replacementNode.unit || replacedRuleUnit
			}
		})

	missingVariableList = missingVariableList.filter(
		missingVariables => !!Object.keys(missingVariables).length
	)

	return [applicableReplacements, missingVariableList]
}

let evaluateReference = (filter, contextRuleName) => (
	cache,
	situation,
	rules,
	node
) => {
	let rule = rules[node.dottedName]
	// When a rule exists in different version (created using the `replace` mecanism), we add
	// a redirection in the evaluation of references to use a potential active replacement
	const [
		applicableReplacements,
		replacementMissingVariableList
	] = getApplicableReplacements(
		filter,
		contextRuleName,
		cache,
		situation,
		rules,
		rule
	)

	if (applicableReplacements.length) {
		if (applicableReplacements.length > 1) {
			console.warn(`
Règle ${rule.dottedName}: plusieurs remplacements valides ont été trouvés : 
\n\t${applicableReplacements.map(node => node.rawNode).join('\n\t')} 

Par défaut, seul le premier s'applique. Si vous voulez un autre comportement, vous pouvez : 
	- Restreindre son applicabilité via "applicable si" sur la règle de définition
	- Restreindre sa portée en ajoutant une liste blanche (via le mot clé "dans") ou une liste noire (via le mot clé "sauf dans")
`)
		}
		return applicableReplacements[0]
	}
	const addReplacementMissingVariable = node => ({
		...node,
		missingVariables: replacementMissingVariableList.reduce(
			mergeMissing,
			node.missingVariables
		)
	})

	let dottedName = node.dottedName,
		// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
		// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
		cacheName = dottedName + (filter ? '.' + filter : ''),
		cached = cache[cacheName]

	if (cached) return addReplacementMissingVariable(cached)

	let cacheNode = (nodeValue, missingVariables, explanation, temporalValue) => {
		cache[cacheName] = {
			...node,
			nodeValue,
			temporalValue,
			...(explanation && {
				explanation
			}),
			...(explanation?.unit && { unit: explanation.unit }),
			missingVariables
		}
		return addReplacementMissingVariable(cache[cacheName])
	}
	const {
		nodeValue: isApplicable,
		missingVariables: condMissingVariables
	} = evaluateApplicability(cache, situation, rules, rule)
	if (!isApplicable) {
		return cacheNode(isApplicable, condMissingVariables, rule)
	}
	const situationValue = getSituationValue(situation, dottedName, rule)
	if (situationValue !== undefined) {
		const unit = getNodeDefaultUnit(rule, cache)
		return cacheNode(situationValue, condMissingVariables, {
			...rule,
			nodeValue: situationValue,
			unit
		})
	}

	if (rule.formule != null) {
		const evaluation = evaluateNode(cache, situation, rules, rule)
		return cacheNode(
			evaluation.nodeValue,
			evaluation.missingVariables,
			evaluation,
			evaluation.temporalValue
		)
	}

	return cacheNode(null, { [dottedName]: rule.defaultValue ? 1 : 2 })
}

export let parseReference = (
	rules,
	rule,
	parsedRules,
	filter
) => partialReference => {
	let dottedName = disambiguateRuleReference(
		rules,
		rule.dottedName,
		partialReference
	)

	let inInversionFormula = rule.formule?.['inversion numérique']

	let parsedRule =
		parsedRules[dottedName] ||
		// the 'inversion numérique' formula should not exist. The instructions to the evaluation should be enough to infer that an inversion is necessary (assuming it is possible, the client decides this)
		(!inInversionFormula && parseRule(rules, dottedName, parsedRules))
	const unit =
		parsedRule.unit || parsedRule.formule?.unit || parsedRule.defaultUnit
	return {
		evaluate: evaluateReference(filter, rule.dottedName),
		//eslint-disable-next-line react/display-name
		jsx: (nodeValue, explanation, _, nodeUnit) => (
			<>
				<Leaf
					classes="variable filtered"
					filter={filter}
					name={partialReference}
					dottedName={dottedName}
					nodeValue={nodeValue}
					unit={nodeUnit || explanation?.unit || unit}
				/>
			</>
		),
		name: partialReference,
		category: 'reference',
		partialReference,
		dottedName,
		unit
	}
}

// This function is a wrapper that can apply :
// - unit transformations to the value of the variable.
// See the unité-temporelle.yaml test suite for details
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
	const { explanation, nodeValue } = filteredNode
	if (!explanation || nodeValue === null) {
		return filteredNode
	}
	const unit = parseResult.unit
	if (unit) {
		try {
			return convertNodeToUnit(unit, filteredNode)
		} catch (e) {
			typeWarning(
				cache._meta.contextRule,
				`Impossible de convertir la reference '${filteredNode.name}'`,
				e
			)
		}
	}

	return filteredNode
}
export let parseReferenceTransforms = (
	rules,
	rule,
	parsedRules
) => parseResult => {
	const referenceName = parseResult.variable.fragments.join(' . ')
	let node = parseReference(
		rules,
		rule,
		parsedRules,
		parseResult.filter
	)(referenceName)

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
		evaluate: evaluateTransforms(node.evaluate, rule, parseResult),
		unit: parseResult.unit || node.unit
	}
}
