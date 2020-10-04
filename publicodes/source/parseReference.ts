import { Leaf } from './components/mecanisms/common'
import { typeWarning } from './error'
import { evaluateApplicability } from './evaluateRule'
import { evaluateNode, mergeMissing } from './evaluation'
import { convertNodeToUnit } from './nodeUnits'
import parseRule from './parseRule'
import { disambiguateRuleReference } from './ruleUtils'
import { EvaluatedNode, ParsedRule } from './types'
import { areUnitConvertible, serializeUnit } from './units'

/**
 * Statically filter out replacements from `replaceBy`.
 * Note: whitelist and blacklist filtering are applicable to the replacement
 * itself or any parent namespace.
 */
export const getApplicableReplacedBy = (contextRuleName, replacedBy) =>
	replacedBy
		.sort(
			(replacement1, replacement2) =>
				+!!replacement2.whiteListedNames - +!!replacement1.whiteListedNames
		)
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

/**
 * Filter-out and apply all possible replacements at runtime.
 */
const getApplicableReplacements = (
	filter,
	contextRuleName,
	cache,
	situation,
	rules,
	rule: ParsedRule
) => {
	let missingVariableList: Array<EvaluatedNode['missingVariables']> = []
	if (contextRuleName.startsWith('[evaluation]')) {
		return [[], []]
	}
	const applicableReplacements = getApplicableReplacedBy(
		contextRuleName,
		rule.replacedBy
	)
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
			const situationValue = situation[referenceRule.dottedName]
			if (referenceNode.question && situationValue == null) {
				missingVariableList.push({ [referenceNode.dottedName]: 1 })
			}
			return situationValue?.nodeValue !== false
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
				: evaluateReference(filter, '')(cache, situation, rules, referenceNode)
		)
		.map(replacementNode => {
			const replacedRuleUnit = rule.unit
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

const evaluateReference = (filter: string, contextRuleName: string) => (
	cache,
	situation,
	rules,
	node
) => {
	const rule = rules[node.dottedName]
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
			// eslint-disable-next-line no-console
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
	const dottedName = node.dottedName
	// On va vérifier dans le cache courant, dict, si la variable n'a pas été déjà évaluée
	// En effet, l'évaluation dans le cas d'une variable qui a une formule, est coûteuse !
	const cacheName = dottedName + (filter ? ' .' + filter : '')
	const cached = cache[cacheName]

	if (cached) return addReplacementMissingVariable(cached)

	const cacheNode = (
		nodeValue: EvaluatedNode['nodeValue'],
		missingVariables: EvaluatedNode['missingVariables'],
		explanation?: Record<string, unknown>
	) => {
		cache[cacheName] = {
			...node,
			nodeValue,
			...(explanation && {
				explanation
			}),
			...(explanation?.temporalValue && {
				temporalValue: explanation.temporalValue
			}),
			...(explanation?.unit && { unit: explanation.unit }),
			missingVariables
		}
		return addReplacementMissingVariable(cache[cacheName])
	}
	const applicabilityEvaluation = evaluateApplicability(
		cache,
		situation,
		rules,
		rule
	)
	if (!applicabilityEvaluation.nodeValue) {
		return cacheNode(
			applicabilityEvaluation.nodeValue,
			applicabilityEvaluation.missingVariables,
			applicabilityEvaluation
		)
	}
	if (situation[dottedName]) {
		// Conditional evaluation is required because some mecanisms like
		// "synchronisation" store raw JS objects in the situation.
		const situationValue = situation[dottedName]?.evaluate
			? evaluateNode(cache, situation, rules, situation[dottedName])
			: situation[dottedName]
		const unit =
			!situationValue.unit || serializeUnit(situationValue.unit) === ''
				? rule.unit
				: situationValue.unit
		return cacheNode(
			situationValue?.nodeValue !== undefined
				? situationValue.nodeValue
				: situationValue,
			applicabilityEvaluation.missingVariables,
			{
				...rule,
				...(situationValue?.nodeValue !== undefined && situationValue),
				unit
			}
		)
	}

	if (rule.defaultValue != null) {
		const evaluation = evaluateNode(cache, situation, rules, rule.defaultValue)
		return cacheNode(evaluation.nodeValue ?? evaluation, {
			...evaluation.missingVariables,
			[dottedName]: 1
		})
	}

	if (rule.formule != null) {
		const evaluation = evaluateNode(cache, situation, rules, rule)
		return cacheNode(
			evaluation.nodeValue,
			evaluation.missingVariables,
			evaluation
		)
	}

	return cacheNode(null, { [dottedName]: 2 })
}

export const parseReference = (
	rules,
	rule,
	parsedRules,
	filter
) => partialReference => {
	const dottedName = disambiguateRuleReference(
		rules,
		rule.dottedName,
		partialReference
	)

	const inInversionFormula = rule.formule?.['inversion numérique']

	const parsedRule =
		parsedRules[dottedName] ||
		// the 'inversion numérique' formula should not exist. The instructions to the evaluation should be enough to infer that an inversion is necessary (assuming it is possible, the client decides this)
		(!inInversionFormula && parseRule(rules, dottedName, parsedRules))
	const unit = parsedRule.unit
	return {
		evaluate: evaluateReference(filter, rule.dottedName),
		jsx: Leaf,
		name: partialReference,
		category: 'reference',
		partialReference,
		dottedName,
		explanation: parsedRule,
		unit
	}
}

// This function is a wrapper that can apply :
// - unit transformations to the value of the variable.
// See the unité-temporelle.yaml test suite for details
// - filters on the variable to select one part of the variable's 'composantes'

const evaluateTransforms = (originalEval, _, parseResult) => (
	cache,
	situation,
	parsedRules,
	node
) => {
	// Filter transformation
	const filteringSituation = {
		...situation,
		'_meta.filter': parseResult.filter
	}
	const filteredNode = originalEval(
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
export const parseReferenceTransforms = (
	rules,
	rule,
	parsedRules
) => parseResult => {
	const referenceName = parseResult.variable.fragments.join(' . ')
	const node = parseReference(
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
						...(node as any).cotisation,
						'dû par': parseResult.filter,
						'impôt sur le revenu': parseResult.filter
					}
			  }
			: {}),
		evaluate: evaluateTransforms(node.evaluate, rule, parseResult),
		unit: parseResult.unit || node.unit
	}
}
