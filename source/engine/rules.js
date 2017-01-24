import rules from './load-rules'
import entityRules from './load-entity-rules'

import possibleVariableTypes from './possibleVariableTypes.yaml'
import {borrify} from './remove-diacritics'
import R from 'ramda'

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


export let enrichRule = rule => {
	let type = possibleVariableTypes.find(t => rule[t])
	return {...rule, type, name: rule[type]}
}

export let hasKnownRuleType = rule => rule && enrichRule(rule).type


let fullDottedName = rule => rule.attache && borrify(
	[	rule.attache,
		do { let {alias, name} = enrichRule(rule)
			alias || name
		}
	].join(' . ')
)

export let findRuleByDottedName = dottedName =>
	entityRules.map(enrichRule).find(rule => fullDottedName(rule) == borrify(dottedName))

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

console.log('findG', findGroup('Salariat . CDD . événements'))
