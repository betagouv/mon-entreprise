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

let enrichRules = input =>
	(typeof input === 'string' ? yaml.safeLoad(input) : input).map(enrichRule)

export default {
	evaluate: (targetNames, nestedSituation, rulesConfig) => {
		let rules = rulesConfig
			? do {
					let { base, extra } = rulesConfig
					parseAll([
						...(base ? enrichRules(base) : rulesFr),
						...(extra ? enrichRules(extra) : [])
					])
			  }
			: defaultRules

		return analyseMany(rules, targetNames)(
			nestedSituationToStateSelector(nestedSituation)
		)
	}
}
