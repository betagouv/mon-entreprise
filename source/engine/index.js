// This file exports the functions of the public computing library
import { analyseMany, parseAll } from './traverse.js'
import {
	rulesFr,
	collectDefaults,
	nestedSituationToPathMap,
	enrichRule
} from './rules'
import yaml from 'js-yaml'

let defaultRules = parseAll(rulesFr)

// The public evaluation function takes a nested object of input values
let nestedSituationToStateSelector = nestedSituation => dottedName =>
	({
		...collectDefaults(rulesFr),
		...nestedSituationToPathMap(nestedSituation)
	}[dottedName])

export default {
	evaluate: (targetNames, nestedSituation, rulesYaml) => {
		let rules = rulesYaml
			? (rules = parseAll(yaml.safeLoad(rulesYaml).map(enrichRule)))
			: defaultRules

		return analyseMany(rules, targetNames)(
			nestedSituationToStateSelector(nestedSituation)
		)
	}
}
