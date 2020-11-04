import { last, pipe, range, take } from 'ramda'
import { syntaxError } from './error'
import { RuleNode } from './rule'

const splitName = (str: string) => str.split(' . ')
const joinName = strs => strs.join(' . ')
export const nameLeaf = pipe<string, string[], string>(splitName, last)
export const encodeRuleName = name =>
	name
		?.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')
export const decodeRuleName = name =>
	name
		.replace(/\//g, ' . ')
		.replace(/-/g, ' ')
		.replace(/\u2011/g, '-')
export function ruleParents<Names extends string>(
	dottedName: Names
): Array<Names> {
	const fragments = splitName(dottedName) // dottedName ex. [CDD . événements . rupture]
	return range(1, fragments.length)
		.map(nbEl => take(nbEl, fragments))
		.map(joinName) //  -> [ [CDD . événements . rupture], [CDD . événements], [CDD
		.reverse()
}

export function disambiguateRuleReference<R extends Record<string, RuleNode>>(
	rules: R,
	contextName: string = '',
	partialName: string
): keyof R {
	const possibleDottedName = [
		contextName,
		...ruleParents(contextName),
		''
	].map(x => (x ? x + ' . ' + partialName : partialName))
	const dottedName = possibleDottedName.find(name => name in rules)
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
