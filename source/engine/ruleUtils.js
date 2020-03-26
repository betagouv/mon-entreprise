import {
	assoc,
	dropLast,
	filter,
	isNil,
	join,
	last,
	map,
	pipe,
	propEq,
	range,
	reduce,
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

/* Traduction */
const translateContrôle = (prop, rule, translation, lang) =>
	assoc(
		'contrôles',
		rule.contrôles.map((control, i) => ({
			...control,
			message: translation[`${prop}.${i}.${lang}`]?.replace(
				/^\[automatic\] /,
				''
			)
		})),
		rule
	)
const translateSuggestion = (prop, rule, translation, lang) =>
	assoc(
		'suggestions',
		Object.entries(rule.suggestions).reduce(
			(acc, [name, value]) => ({
				...acc,
				[translation[`${prop}.${name}.${lang}`]?.replace(
					/^\[automatic\] /,
					''
				)]: value
			}),
			{}
		),
		rule
	)

export const attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'contrôles',
	'note'
]

export let translateAll = (translations, flatRules) => {
	let translationsOf = rule => translations[rule.dottedName],
		translateProp = (lang, translation) => (rule, prop) => {
			if (prop === 'contrôles' && rule?.contrôles) {
				return translateContrôle(prop, rule, translation, lang)
			}
			if (prop === 'suggestions' && rule?.suggestions) {
				return translateSuggestion(prop, rule, translation, lang)
			}
			let propTrans = translation[prop + '.' + lang]
			propTrans = propTrans?.replace(/^\[automatic\] /, '')
			return propTrans ? assoc(prop, propTrans, rule) : rule
		},
		translateRule = (lang, translations, props) => rule => {
			let ruleTrans = translationsOf(rule)
			return ruleTrans
				? reduce(translateProp(lang, ruleTrans), rule, props)
				: rule
		}
	return map(
		translateRule('en', translations, attributesToTranslate),
		flatRules
	)
}

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
