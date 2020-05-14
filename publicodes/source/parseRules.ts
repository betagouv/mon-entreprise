import parseRule from './parseRule'
import yaml from 'yaml'
import { lensPath, set } from 'ramda'
import { compilationError } from './error'
import { parseReference } from './parseReference'
import { ParsedRules, Rules } from './types'

export default function parseRules<Names extends string>(
	rawRules: Rules<Names> | string
): ParsedRules<Names> {
	const rules =
		typeof rawRules === 'string'
			? (yaml.parse(rawRules.replace(/\t/g, '  ')) as Rules<Names>)
			: { ...rawRules }

	extractInlinedNames(rules)

	/* First we parse each rule one by one. When a mechanism is encountered, it is
	recursively parsed. When a reference to a variable is encountered, a
	'variable' node is created, we don't parse variables recursively. */
	const parsedRules = {}

	/* A rule `A` can disable a rule `B` using the rule `rend non applicable: B`
	in the definition of `A`. We need to map these exonerations to be able to
	retreive them from `B` */
	const nonApplicableMapping: Record<string, any> = {}
	const replacedByMapping: Record<string, any> = {}
	;(Object.keys(rules) as Names[]).map(dottedName => {
		const parsedRule = parseRule(rules, dottedName, parsedRules)

		if (parsedRule['rend non applicable']) {
			nonApplicableMapping[parsedRule.dottedName] =
				parsedRule['rend non applicable']
		}

		const replaceDescriptors = parsedRule['remplace']
		if (replaceDescriptors) {
			replaceDescriptors.forEach(
				descriptor =>
					(replacedByMapping[descriptor.referenceName] = [
						...(replacedByMapping[descriptor.referenceName] ?? []),
						{ ...descriptor, referenceName: parsedRule.dottedName }
					])
			)
		}
	})

	Object.entries(nonApplicableMapping).forEach(([a, b]) => {
		b.forEach(ruleName => {
			parsedRules[ruleName].isDisabledBy.push(
				parseReference(rules, parsedRules[ruleName], parsedRules)(a)
			)
		})
	})
	Object.entries(replacedByMapping).forEach(([a, b]) => {
		parsedRules[a].replacedBy = b.map(({ referenceName, ...other }) => ({
			referenceNode: parseReference(
				rules,
				parsedRules[referenceName],
				parsedRules
			)(referenceName),
			...other
		}))
	})

	return parsedRules as ParsedRules<Names>
}

// We recursively traverse the YAML tree in order to extract named parameters
// into their own dedicated rules, and replace the inline definition with a
// reference to the newly created rule.
function extractInlinedNames(rules: Record<string, Record<string, any>>) {
	const extractNamesInRule = (dottedName: string) => {
		rules[dottedName] !== null &&
			Object.entries(rules[dottedName]).forEach(
				extractNamesInObject(dottedName)
			)
	}
	const extractNamesInObject = (
		dottedName: string,
		context: Array<string | number> = []
	) => ([key, value]: [string, Record<string, any>]) => {
		const match = /\[ref( (.+))?\]$/.exec(key)
		if (match) {
			const argumentType = key.replace(match[0], '').trim()
			const argumentName = match[2]?.trim() || argumentType
			const extractedReferenceName = `${dottedName} . ${argumentName}`

			if (typeof rules[extractedReferenceName] !== 'undefined') {
				compilationError(
					dottedName,
					`Le paramètre [ref] ${argumentName} entre en conflit avec la règle déjà existante ${extractedReferenceName}`
				)
			}

			rules[extractedReferenceName] = {
				formule: value,
				// TODO: The `virtualRule` parameter should be used to avoid creating a
				// dedicated documentation page.
				virtualRule: true
			}
			rules[dottedName] = set(
				lensPath([...context, argumentType]),
				extractedReferenceName,
				rules[dottedName]
			)
			extractNamesInRule(extractedReferenceName)
		} else if (Array.isArray(value)) {
			value.forEach((content: Record<string, any>, i) =>
				Object.entries(content).forEach(
					extractNamesInObject(dottedName, [...context, key, i])
				)
			)
		} else if (value && typeof value === 'object') {
			Object.entries(value).forEach(
				extractNamesInObject(dottedName, [...context, key])
			)
		}
	}

	Object.keys(rules).forEach(extractNamesInRule)
}
