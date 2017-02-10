// Séparation artificielle, temporaire, entre ces deux types de règles
import rawRules from './load-rules'
import rawEntityRules from './load-entity-rules'
import R from 'ramda'
import possibleVariableTypes from './possibleVariableTypes.yaml'


/***********************************
 Méthodes agissant sur une règle */

// Enrichissement de la règle avec des informations évidentes pour un lecteur humain
export let enrichRule = rule => {
	let
		type = possibleVariableTypes.find(t => rule[t]),
		name = rule[type],
		dottedName = rule.attache && [
			rule.attache,
			rule.alias || name
		].join(' . ')

	return {...rule, type, name, dottedName}
}

export let hasKnownRuleType = rule => rule && enrichRule(rule).type

let
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

// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let [rules, entityRules] =
	[rawRules, rawEntityRules].map(rules => rules.map(enrichRule))


/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = search =>
	[...rules, ...entityRules]
		.map(enrichRule)
		.find( ({name}) =>
			name === search
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).toLowerCase().indexOf(searchInput) > -1)
		.map(enrichRule)



export let findRuleByDottedName = dottedName =>
	entityRules.find(rule => rule.dottedName == dottedName)

export let findGroup = R.pipe(
	findRuleByDottedName,
	found => found && found['choix exclusifs'] && found,
	// Is there a way to express this more litterally in ramda ?
	// R.unless(
	// 	R.isNil,
	// 	R.when(
	// 		R.has('choix exclusifs'),
	// 		R.identity
	// 	)
	// )
)
