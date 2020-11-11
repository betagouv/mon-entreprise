import { Leaf } from './components/mecanisms/common'
import parseRule from './parseRule'
import { disambiguateRuleReference } from './ruleUtils'

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
		// TODO: The 'inversion numérique' formula should not exist. The instructions to
		// the evaluation should be enough to infer that an inversion is necessary
		// (assuming it is possible, the client decides this) #767
		(!inInversionFormula && parseRule(rules, dottedName, parsedRules))

	const contextRuleName = rule.dottedName
	if (
		// TODO: At this point in the code, the parsedRule value should never be the
		// string "being parsed", this is a ordering problem.
		parsedRule !== 'being parsed' &&
		parsedRule !== false &&
		rule.dottedName &&
		!contextRuleName.startsWith('[evaluation]')
	) {
		rule.dependencies?.add(dottedName)
	}

	const unit = parsedRule.unit
	return {
		nodeKind: 'reference',
		jsx: Leaf,
		name: partialReference,
		category: 'reference',
		partialReference,
		dottedName,
		explanation: { ...parsedRule, filter, contextRuleName },
		unit
	}
}

type parseReferenceTransformsParameters = {
	variable: { fragments: Array<string> }
	filter?: string
	unit?: string
}

export const parseReferenceTransforms = (rules, rule, parsedRules) => ({
	variable,
	filter,
	unit
}: parseReferenceTransformsParameters) => {
	const originalNode = parseReference(
		rules,
		rule,
		parsedRules,
		filter
	)(variable)

	return {
		...originalNode,
		nodeKind: 'referenceWithTransforms',
		explanation: {
			originalNode,
			filter,
			unit
		},
		// Decorate node with the composante filter (either who is paying, either tax free)
		...(filter
			? {
					cotisation: {
						...(originalNode as any).cotisation,
						'dû par': filter,
						'impôt sur le revenu': filter
					}
			  }
			: {}),
		unit: unit || originalNode.unit
	}
}
