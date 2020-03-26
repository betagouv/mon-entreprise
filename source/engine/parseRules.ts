import parseRule from 'Engine/parseRule'
import { safeLoad } from 'js-yaml'
import { parseReference } from './parseReference'

/*
 Dans ce fichier, les règles YAML sont parsées.
 Elles expriment un langage orienté expression, les expressions étant
 - préfixes quand elles sont des 'mécanismes' (des mot-clefs représentant des calculs courants dans la loi)
 - infixes pour les feuilles : des tests d'égalité, d'inclusion, des comparaisons sur des variables ou tout simplement la  variable elle-même, ou une opération effectuée sur la variable

*/

export default function parseRules(rules) {
	rules =
		typeof rules === 'string' ? safeLoad(rules.replace(/\t/g, '  ')) : rules

	/* First we parse each rule one by one. When a mechanism is encountered, it is
	recursively parsed. When a reference to a variable is encountered, a
	'variable' node is created, we don't parse variables recursively. */

	let parsedRules = {}

	/* A rule `A` can disable a rule `B` using the rule `rend non applicable: B`
	in the definition of `A`. We need to map these exonerations to be able to
	retreive them from `B` */
	let nonApplicableMapping: Record<string, any> = {}
	let replacedByMapping: Record<string, any> = {}
	Object.keys(rules).map(dottedName => {
		const rule = parseRule(rules, dottedName, parsedRules)

		if (rule['rend non applicable']) {
			nonApplicableMapping[rule.dottedName] = rule['rend non applicable']
		}

		const replaceDescriptors = rule['remplace']
		if (replaceDescriptors) {
			replaceDescriptors.forEach(
				descriptor =>
					(replacedByMapping[descriptor.referenceName] = [
						...(replacedByMapping[descriptor.referenceName] ?? []),
						{ ...descriptor, referenceName: rule.dottedName }
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

	/* Then we need to infer units. Since only references to variables have been created, we need to wait for the latter map to complete before starting this job. Consider this example :
		A = B * C
		B = D / E
	
		C unité km
		D unité €
		E unité km
	 *
	 * When parsing A's formula, we don't know the unit of B, since only the final nodes have units (it would be too cumbersome to specify a unit to each variable), and B hasn't been parsed yet.
	 *
	 * */
	return parsedRules
}
