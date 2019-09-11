// This file exports the functions of the public computing library
import { safeLoad } from 'js-yaml'
import {
	collectDefaults,
	enrichRule,
	nestedSituationToPathMap,
	rulesFr
} from './rules'
import { analyseMany, parseAll } from './traverse.js'

// The public evaluation function takes a nested object of input values
let nestedSituationToStateSelector = rules => nestedSituation => dottedName =>
	({
		...collectDefaults(rules),
		...nestedSituationToPathMap(nestedSituation)
	}[dottedName])

let enrichRules = input =>
	(typeof input === 'string' ? safeLoad(input) : input).map(enrichRule)

export default {
	evaluate: (targetInput, nestedSituation, config) => {
		let rules = config
			? [
					...(config.base ? enrichRules(config.base) : rulesFr),
					...(config.extra ? enrichRules(config.extra) : [])
			  ]
			: rulesFr

		let evaluation = analyseMany(
			parseAll(rules),
			Array.isArray(targetInput) ? targetInput : [targetInput]
		)(nestedSituationToStateSelector(rules)(nestedSituation))
		if (config?.debug) return evaluation

		let values = evaluation.targets.map(t => t.nodeValue)

		return Array.isArray(targetInput) ? values : values[0]
	}
}
