import yaml from 'yaml'
import { ParsedRules, Logger } from '.'
import { makeASTTransformer, traverseParsedRules } from './AST'
import parse from './parse'
import { getReplacements, makeInlineReplacements } from './replacement'
import { Rule, RuleNode } from './rule'
import { disambiguateRuleReference } from './ruleUtils'
import { getUnitKey } from './units'

export type Context = {
	dottedName: string
	parsedRules: Record<string, RuleNode>
	ruleTitle?: string
	getUnitKey?: getUnitKey
	logger: Logger
}

type RawRule = Omit<Rule, 'nom'> | string | number
export type RawPublicodes = Record<string, RawRule>

export default function parsePublicodes(
	rawRules: RawPublicodes | string,
	partialContext: Partial<Context> = {}
): ParsedRules<string> {
	// STEP 1: parse Yaml
	let rules =
		typeof rawRules === 'string'
			? (yaml.parse(('' + rawRules).replace(/\t/g, '  ')) as RawPublicodes)
			: { ...rawRules }

	// STEP 2: transpile [ref] writing
	rules = transpileRef(rules)

	// STEP 3: Rules parsing
	const context: Context = {
		dottedName: partialContext.dottedName ?? '',
		parsedRules: partialContext.parsedRules ?? {},
		logger: partialContext.logger ?? console,
		getUnitKey: partialContext.getUnitKey ?? ((x) => x),
	}

	Object.entries(rules).forEach(([dottedName, rule]) => {
		if (typeof rule === 'string' || typeof rule === 'number') {
			rule = {
				formule: `${rule}`,
			}
		}
		if (typeof rule !== 'object') {
			throw new SyntaxError(
				`Rule ${dottedName} is incorrectly written. Please give it a proper value.`
			)
		}
		parse({ nom: dottedName, ...rule }, context)
	})
	let parsedRules = context.parsedRules

	// STEP 4: Disambiguate reference
	parsedRules = traverseParsedRules(
		makeDisambiguateReference(parsedRules),
		parsedRules
	)

	// STEP 5: Inline replacements
	const replacements = getReplacements(parsedRules)
	parsedRules = traverseParsedRules(
		makeInlineReplacements(replacements, context.logger),
		parsedRules
	)

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
	object
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
				valeur: transpileRef(value),
			},
		}
	}, {})
}

export const makeDisambiguateReference = (
	parsedRules: Record<string, RuleNode>
) =>
	makeASTTransformer((node) => {
		if (node.nodeKind === 'reference') {
			const dottedName = disambiguateRuleReference(
				parsedRules,
				node.contextDottedName,
				node.name
			)
			return {
				...node,
				dottedName,
				title: parsedRules[dottedName].title,
				acronym: parsedRules[dottedName].rawNode.acronyme,
			}
		}
	})
