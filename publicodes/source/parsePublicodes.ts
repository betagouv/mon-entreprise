import yaml from 'yaml'
import { traverseParsedRules, updateAST } from './AST'
import parse from './parse'
import { inlineReplacements } from './replacement'
import { Rule, RuleNode } from './rule'
import { disambiguateRuleReference } from './ruleUtils'

export type Context = {
	dottedName: string
	parsedRules: Record<string, RuleNode>
}

type RawRule = Omit<Rule, 'nom'> | string | undefined | number
export type RawPublicodes = Record<string, RawRule> | string

export default function parsePublicodes<Names extends string>(
	rawRules: RawPublicodes,
	partialContext: Partial<Context> = {}
) {
	// STEP 1: parse Yaml
	let rules =
		typeof rawRules === 'string'
			? (yaml.parse(('' + rawRules).replace(/\t/g, '  ')) as Record<
					string,
					RawRule
			  >)
			: { ...rawRules }

	// STEP 2: transpile [ref] writing
	rules = transpileRef(rules)

	// STEP 3: Rules parsing
	const context: Context = {
		dottedName: partialContext.dottedName ?? '',
		parsedRules: partialContext.parsedRules ?? {}
	}

	Object.entries(rules).forEach(([dottedName, rule]) => {
		if (rule == null) {
			rule = {}
		}
		if (typeof rule !== 'object') {
			rule = {
				formule: rule
			}
		}
		parse({ nom: dottedName, ...rule }, context)
	})
	let parsedRules = context.parsedRules

	// STEP 4: Disambiguate reference
	parsedRules = traverseParsedRules(
		disambiguateReference(parsedRules),
		parsedRules
	) as Record<string, RuleNode>

	// STEP 5: Inline replacements
	parsedRules = inlineReplacements(parsedRules)

	// TODO STEP 6: check for cycle

	// TODO STEP 7: type check

	return parsedRules
}

// We recursively traverse the YAML tree in order to transform named parameters
// into rules.
function transpileRef(object: Record<string, any> | string | Array<any>) {
	if (Array.isArray(object)) {
		return object.map(transpileRef)
	}
	if (!object || typeof object !== 'object') {
		return object
	}
	object as Record<string, any>
	return Object.entries(object).reduce((obj, [key, value]) => {
		const match = /\[ref( (.+))?\]$/.exec(key)

		if (!match) {
			return { ...obj, [key]: transpileRef(value) }
		}

		const argumentType = key.replace(match[0], '').trim()
		const argumentName = match[2]?.trim() || argumentType

		return {
			...obj,
			[argumentType]: {
				nom: argumentName,
				valeur: transpileRef(value)
			}
		}
	}, {})
}

export const disambiguateReference = (parsedRules: Record<string, RuleNode>) =>
	updateAST(node => {
		if (node.nodeKind === 'reference') {
			return {
				...node,
				dottedName: disambiguateRuleReference(
					parsedRules,
					node.contextDottedName,
					node.name
				)
			}
		}
	})
