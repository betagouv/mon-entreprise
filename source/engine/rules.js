import rules from './load-rules'
import entityRules from './load-entity-rules'

import possibleVariableTypes from './possibleVariableTypes.yaml'
import {borrify} from './remove-diacritics'

export let findRuleByName = search =>
	rules
		.map(extractRuleTypeAndName)
		.find( ({name}) =>
			name === search
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).indexOf(searchInput) > -1)
		.map(extractRuleTypeAndName)


export let extractRuleTypeAndName = rule => {
	let type = possibleVariableTypes.find(t => rule[t])
	return {type, name: rule[type], rule, alias: rule.alias}
}

export let hasKnownRuleType = rule => rule && extractRuleTypeAndName(rule).type


let fullDottedName = rule => rule.attache && borrify(
	[	rule.attache,
		(({alias, name}) => alias || name)(extractRuleTypeAndName(rule)),
	].join(' . ')
)

export let findGroup = dottedName => console.log('findGroup', dottedName) ||
	entityRules.find(rule => fullDottedName(rule) == dottedName && rule['choix exclusif'])
