import rules from './load-rules'
import possibleVariableTypes from './possibleVariableTypes.yaml'


export let findRuleByName = name =>
	rules
		.map(extractRuleTypeAndName)
		.find( ([, n]) =>
			n === name
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).indexOf(searchInput) > -1)
		.map(extractRuleTypeAndName)


export let extractRuleTypeAndName = rule => {
	let type = possibleVariableTypes.find(t => rule[t])
	return [type, rule[type], rule]
}

export let hasKnownRuleType = rule => rule && extractRuleTypeAndName(rule)[0]
