// Séparation artificielle, temporaire, entre ces deux types de règles
import rawRules from 'Règles/base.yaml'
import translations from 'Règles/externalized.yaml'
import {
	assoc,
	has,
	pipe,
	toPairs,
	map,
	fromPairs,
	split,
	join,
	dropLast,
	take,
	propEq,
	reduce,
	when,
	is,
	props,
	identity,
	path,
	reject,
	reduced,
	range,
	last
} from 'ramda'
import possibleVariableTypes from './possibleVariableTypes.yaml'
import marked from './marked'
import { capitalise0 } from '../utils'
import formValueTypes from 'Components/conversation/formValueTypes'

// TODO - should be in UI, not engine
import taux_versement_transport from 'Règles/taux-versement-transport.json'

// console.log('rawRules', rawRules.map(({espace, nom}) => espace + nom))
/***********************************
 Méthodes agissant sur une règle */

// Enrichissement de la règle avec des informations évidentes pour un lecteur humain
export let enrichRule = (rule, sharedData = {}) => {
	let type = possibleVariableTypes.find(t => has(t, rule) || rule.type === t),
		name = rule['nom'],
		title = capitalise0(rule['titre'] || name),
		ns = rule['espace'],
		data = rule['données'] ? sharedData[rule['données']] : null,
		dottedName = buildDottedName(rule),
		subquestionMarkdown = rule['sous-question'],
		subquestion = subquestionMarkdown && marked(subquestionMarkdown),
		defaultValue = rule['par défaut']

	return {
		...rule,
		type,
		name,
		title,
		ns,
		data,
		dottedName,
		subquestion,
		defaultValue
	}
}

let buildDottedName = rule =>
	rule['espace'] ? [rule['espace'], rule['nom']].join(' . ') : rule['nom']

export let disambiguateExampleSituation = (rules, rule) =>
	pipe(
		toPairs,
		map(([k, v]) => [disambiguateRuleReference(rules, rule, k), v]),
		fromPairs
	)

export let hasKnownRuleType = rule => rule && enrichRule(rule).type

export let splitName = split(' . '),
	joinName = join(' . ')

export let parentName = pipe(splitName, dropLast(1), joinName)
export let nameLeaf = pipe(splitName, last)

export let encodeRuleName = name =>
	name.replace(/\s\.\s/g, '--').replace(/\s/g, '-')
export let decodeRuleName = name =>
	name.replace(/--/g, ' . ').replace(/-/g, ' ')

/* Les variables peuvent être exprimées dans la formule d'une règle relativement à son propre espace de nom, pour une plus grande lisibilité. Cette fonction résoud cette ambiguité.
*/
export let disambiguateRuleReference = (
	allRules,
	{ ns, name },
	partialName
) => {
	let fragments = ns ? [...ns.split(' . '), name] : [], // ex. [CDD . événements . rupture]
		pathPossibilities = range(0, fragments.length + 1) // -> [ [CDD . événements . rupture], [CDD . événements], [CDD] ]
			.map(nbEl => take(nbEl)(fragments))
			.reverse(),
		found = reduce(
			(res, path) =>
				when(is(Object), reduced)(
					findRuleByDottedName(allRules, [...path, partialName].join(' . '))
				),
			null,
			pathPossibilities
		)

	return (
		(found && found.dottedName) ||
		do {
			throw new Error(`OUUUUPS la référence '${partialName}' dans la règle '${name}' est introuvable dans la base`)
		}
	)
}

export let collectDefaults = pipe(
	map(props(['dottedName', 'defaultValue'])),
	reject(([, v]) => v === undefined),
	fromPairs
)

/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = (allRules, query) =>
	allRules.find(({ name }) => name === query)

export let findRulesByName = (allRules, query) =>
	allRules.filter(({ name }) => name === query)

export let searchRules = searchInput =>
	rules
		.filter(
			rule =>
				rule &&
				hasKnownRuleType(rule) &&
				JSON.stringify(rule)
					.toLowerCase()
					.indexOf(searchInput) > -1
		)
		.map(enrichRule)

export let findRuleByDottedName = (allRules, dottedName) => {
	return allRules.find(rule => rule.dottedName == dottedName)
}

export let findRule = (rules, nameOrDottedName) =>
	nameOrDottedName.includes(' . ')
		? findRuleByDottedName(rules, nameOrDottedName)
		: findRuleByName(rules, nameOrDottedName)

export let findRuleByNamespace = (allRules, ns) =>
	allRules.filter(propEq('ns', ns))

/*********************************
 Autres */

let isVariant = path(['formule', 'une possibilité'])

export let formatInputs = (flatRules, formValueSelector) => state => name => {
	// Our situationGate retrieves data from the "conversation" form
	// The search below is to apply input conversions such as replacing "," with "."
	if (name.startsWith('sys.')) return null

	let rule = findRuleByDottedName(flatRules, name),
		format = rule ? formValueTypes[rule.format] : null,
		pre = format && format.validator.pre ? format.validator.pre : identity,
		value = formValueSelector('conversation')(state, name)

	return value && pre(value)
}

/* Traduction */

export let translateAll = (translations, flatRules) => {
	let translationsOf = rule => translations[buildDottedName(rule)],
		translateProp = (lang, translation) => (rule, prop) => {
			let propTrans = translation[prop + '.' + lang]
			return propTrans ? assoc(prop, propTrans, rule) : rule
		},
		translateRule = (lang, translations, props) => rule => {
			let ruleTrans = translationsOf(rule)
			return ruleTrans
				? reduce(translateProp(lang, ruleTrans), rule, props)
				: rule
		}

	let targets = ['titre', 'description', 'question', 'sous-question', 'résumé']

	return map(translateRule('en', translations, targets), flatRules)
}

// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = translateAll(translations, rawRules).map(rule =>
	enrichRule(rule, { taux_versement_transport })
)
