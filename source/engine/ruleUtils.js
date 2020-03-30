import {
	dropLast,
	filter,
	isNil,
	join,
	last,
	map,
	pipe,
	propEq,
	range,
	reject,
	split,
	take
} from 'ramda'
import { coerceArray } from '../utils'

export const splitName = split(' . ')
export const joinName = join(' . ')
export const parentName = pipe(splitName, dropLast(1), joinName)
export const nameLeaf = pipe(splitName, last)
export const encodeRuleName = name =>
	encodeURI(
		name
			.replace(/\s\.\s/g, '/')
			.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
			.replace(/\s/g, '-')
	)
export let decodeRuleName = name =>
	decodeURI(
		name
			.replace(/\//g, ' . ')
			.replace(/-/g, ' ')
			.replace(/\u2011/g, '-')
	)
export let ruleParents = dottedName => {
	let fragments = splitName(dottedName) // dottedName ex. [CDD . événements . rupture]
	return range(1, fragments.length)
		.map(nbEl => take(nbEl)(fragments))
		.map(joinName) //  -> [ [CDD . événements . rupture], [CDD . événements], [CDD
		.reverse()
}

export let disambiguateRuleReference = (rules, contextName, partialName) => {
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

export function collectDefaults(parsedRules) {
	return Object.values(parsedRules).reduce(
		(acc, rule) => ({
			...acc,
			...(rule?.defaultValue != null && {
				[rule.dottedName]: rule.defaultValue
			})
		}),
		{}
	)
}

/*********************************
 Autres 
 */

export let findParentDependencies = (rules, rule) => {
	// A parent dependency means that one of a rule's parents is not just a namespace holder, it is a boolean question. E.g. is it a fixed-term contract, yes / no
	// When it is resolved to false, then the whole branch under it is disactivated (non applicable)
	// It lets those children omit obvious and repetitive parent applicability tests
	let parentDependencies = ruleParents(rule.dottedName)
	return pipe(
		map(parent => ({ dottedName: parent, ...rules[parent] })),
		reject(isNil),
		filter(
			//Find the first "calculable" parent
			({ question, unit, formule }) =>
				(question && !unit && !formule) ||
				(question && formule?.['une possibilité'] !== undefined) ||
				(typeof formule === 'string' && formule.includes(' = ')) ||
				formule === 'oui' ||
				formule === 'non' ||
				formule?.['une de ces conditions'] ||
				formule?.['toutes ces conditions']
		),
		map(parent => parent.dottedName)
	)(parentDependencies)
}

export let getRuleFromAnalysis = analysis => dottedName => {
	if (!analysis) {
		throw new Error("[getRuleFromAnalysis] The analysis can't be nil !")
	}

	let rule = coerceArray(analysis) // In some simulations, there are multiple "branches" : the analysis is run with e.g. 3 different input situations
		.map(
			analysis =>
				analysis.cache[dottedName]?.explanation || // the cache stores a reference to a variable, the variable is contained in the 'explanation' attribute
				analysis.targets.find(propEq('dottedName', dottedName))
		)
		.filter(Boolean)[0]
	if (process.env.NODE_ENV !== 'production' && !rule) {
		console.warn(`[getRuleFromAnalysis] Unable to find the rule ${dottedName}`)
	}

	return rule
}
