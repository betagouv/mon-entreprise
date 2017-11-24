
// Séparation artificielle, temporaire, entre ces deux types de règles
import rawRules from './load-rules'
import R from 'ramda'
import possibleVariableTypes from './possibleVariableTypes.yaml'
import marked from './marked'
import {capitalise0} from '../utils'
import formValueTypes from 'Components/conversation/formValueTypes'

// TODO - should be in UI, not engine
import taux_versement_transport from '../../règles/rémunération-travail/cotisations/ok/liste-taux.json'

 // console.log('rawRules', rawRules.map(({espace, nom}) => espace + nom))
/***********************************
 Méthodes agissant sur une règle */

// Enrichissement de la règle avec des informations évidentes pour un lecteur humain
export let enrichRule = (rule, sharedData = {}) => {
	let
		type = possibleVariableTypes.find(t => R.has(t, rule) || rule.type === t),
		name = rule['nom'],
		title = capitalise0(rule['titre'] || name),
		ns = rule['espace'],
		data = rule['données'] ? sharedData[rule['données']] : null,
		dottedName = (ns ? [
			ns,
			name
		].join(' . ') : name).toLowerCase(),
		subquestionMarkdown = rule['sous-question'],
		subquestion = subquestionMarkdown && marked(subquestionMarkdown),
		defaultValue = rule['par défaut']

	return {...rule, type, name, title, ns, data, dottedName, subquestion, defaultValue}
}

export let hasKnownRuleType = rule => rule && enrichRule(rule).type

export let
	splitName = R.split(' . '),
	joinName = R.join(' . ')

export let parentName = R.pipe(
	splitName,
	R.dropLast(1),
	joinName
)
export let nameLeaf = R.pipe(
	splitName,
	R.last
)

export let encodeRuleName = name => name.replace(/\s/g, '-')
export let decodeRuleName = name => name.replace(/\-/g, ' ')

/* Les variables peuvent être exprimées dans la formule d'une règle relativement à son propre espace de nom, pour une plus grande lisibilité. Cette fonction résoud cette ambiguité.
*/

export let disambiguateRuleReference = (allRules, {ns, name}, partialName) => {
	let
		fragments = ns ? ns.split(' . ') : [], // ex. [CDD . événements . rupture]
		pathPossibilities = // -> [ [CDD . événements . rupture], [CDD . événements], [CDD] ]
			R.range(0, fragments.length + 1)
			.map(nbEl => R.take(nbEl)(fragments))
			.reverse(),
		found = R.reduce((res, path) =>
			R.when(
				R.is(Object), R.reduced
			)(findRuleByDottedName(allRules, [...path, partialName].join(' . ')))
		, null, pathPossibilities)

	return found && found.dottedName || do {
		throw `OUUUUPS la référence '${partialName}' dans la règle '${name}' est introuvable dans la base`
	}
}

export let collectDefaults = R.pipe(
	R.map(R.props(['dottedName', 'defaultValue'])),
	R.reject(([,v]) => v === undefined),
	R.fromPairs
)


// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = rawRules.map(rule => enrichRule(rule, {taux_versement_transport}))


/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = (allRules, search) =>
	allRules
		.find( ({name}) =>
			name.toLowerCase() === search.toLowerCase()
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).toLowerCase().indexOf(searchInput) > -1)
		.map(enrichRule)

export let findRuleByDottedName = (allRules, dottedName) => {
	let query = dottedName.toLowerCase()
	return allRules.find(rule => rule.dottedName == query)
}

/*********************************
Autres */

let isVariant = R.path(['formule', 'une possibilité'])

export let formatInputs = (flatRules, formValueSelector) => state => name => {
	// Our situationGate retrieves data from the "conversation" form
	// The search below is to apply input conversions such as replacing "," with "."
	if (name.startsWith('sys.')) return null

	let rule = findRuleByDottedName(flatRules, name),
		format = rule ? formValueTypes[rule.format] : null,
		pre = format && format.validator.pre ? format.validator.pre : R.identity,
		value = formValueSelector('conversation')(state, name)

	return value && pre(value)
}
