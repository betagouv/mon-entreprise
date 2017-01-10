import rules from './load-rules'
import possibleVariableTypes from './possibleVariableTypes.yaml'


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
	return {type, name: rule[type], rule}
}

export let hasKnownRuleType = rule => rule && extractRuleTypeAndName(rule).type
