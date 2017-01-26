// Séparation artificielle, temporaire, entre ces deux types de règles
import rawRules from './load-rules'
import rawEntityRules from './load-entity-rules'
import R from 'ramda'
import possibleVariableTypes from './possibleVariableTypes.yaml'
import {borrify} from './remove-diacritics'


/***********************************
 Méthodes agissant sur une règle */

export let enrichRule = rule => {
	let
		type = possibleVariableTypes.find(t => rule[t]),
		name = rule[type],
		dottedName = rule.attache && borrify(
			[	rule.attache,	rule.alias || name].join(' . ')
		)
		console.log('enrich : dottedName', dottedName)

	return {...rule, type, name, dottedName}
}

export let hasKnownRuleType = rule => rule && enrichRule(rule).type



// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
let [rules, entityRules] = //R.map(R.map(enrichRule))([rawRules, rawEntityRules])
	[rawRules, rawEntityRules].map(rules => rules.map(enrichRule))


/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = search =>
	rules
		.map(enrichRule)
		.find( ({name}) =>
			name === search
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).indexOf(searchInput) > -1)
		.map(enrichRule)



export let findRuleByDottedName = dottedName =>
	entityRules.find(rule => rule.dottedName == borrify(dottedName))

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
