import { last, pipe, range, take } from 'ramda'
import { Rule, Rules } from './types'

const splitName = (str: string) => str.split(' . ')
const joinName = strs => strs.join(' . ')
export const nameLeaf = pipe(splitName, last)
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

export function disambiguateRuleReference<Names extends string>(
	rules: Rules<Names>,
	contextName: Names,
	partialName: string
) {
	const possibleDottedName = [
		contextName,
		...ruleParents(contextName),
		''
	].map(x => (x ? x + ' . ' + partialName : partialName))
	const dottedName = possibleDottedName.find(name => name in rules)
	if (!dottedName) {
		throw new Error(`La référence '${partialName}' est introuvable.
	Vérifiez que l'orthographe et l'espace de nom sont corrects`)
	}
	return dottedName
}

export function findParentDependencies<Names extends string>(
	rules: Rules<Names>,
	name: Names
): Array<Names> {
	// A parent dependency means that one of a rule's parents is not just a namespace holder, it is a boolean question. E.g. is it a fixed-term contract, yes / no
	// When it is resolved to false, then the whole branch under it is disactivated (non applicable)
	// It lets those children omit obvious and repetitive parent applicability tests
	return ruleParents(name)
		.map(parent => [parent, rules[parent]] as [Names, Rule])
		.filter(([_, rule]) => !!rule)
		.filter(
			([_, { question, unité, formule, type }]) =>
				//Find the first "calculable" parent
				(question && !unité && !formule) ||
				type === 'groupe' ||
				(question && formule?.['une possibilité'] !== undefined) ||
				(typeof formule === 'string' && formule.includes(' = ')) ||
				formule === 'oui' ||
				formule === 'non' ||
				formule?.['une de ces conditions'] ||
				formule?.['toutes ces conditions']
		)
		.map(([name, _]) => name)
}
