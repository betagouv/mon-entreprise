import { syntaxError } from './error'
import { RuleNode } from './rule'

const splitName = (str: string) => str.split(' . ')
const joinName = (strs: Array<string>) => strs.join(' . ')
export const nameLeaf = (name: string) => splitName(name).slice(-1)?.[0]
export const encodeRuleName = (name) =>
	name
		?.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')
export const decodeRuleName = (name) =>
	name
		.replace(/\//g, ' . ')
		.replace(/-/g, ' ')
		.replace(/\u2011/g, '-')
export function ruleParents(dottedName: string): Array<string> {
	const fragments = splitName(dottedName) // dottedName ex. [CDD . événements . rupture]
	return Array(fragments.length - 1)
		.fill(0)
		.map((f, i) => fragments.slice(0, i + 1))
		.map(joinName)
		.reverse()
}

export function disambiguateRuleReference<R extends Record<string, RuleNode>>(
	rules: R,
	contextName = '',
	partialName: string
): keyof R {
	const possibleDottedName = [contextName, ...ruleParents(contextName), '']
		.map((x) => (x ? x + ' . ' + partialName : partialName))
		// Rules can reference themselves, but it should be the last thing to check
		.sort((a, b) => (a === contextName ? 1 : b === contextName ? -1 : 0))

	const dottedName = possibleDottedName.find((name) => name in rules)
	if (!dottedName) {
		syntaxError(
			contextName,
			`La référence '${partialName}' est introuvable.
	Vérifiez que l'orthographe et l'espace de nom sont corrects`
		)
		throw new Error()
	}
	return dottedName
}

export function ruleWithDedicatedDocumentationPage(rule) {
	return (
		rule.virtualRule !== true &&
		rule.type !== 'groupe' &&
		rule.type !== 'texte' &&
		rule.type !== 'paragraphe' &&
		rule.type !== 'notification'
	)
}
