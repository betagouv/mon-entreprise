// This file exports the functions of the public computing library
import {
	collectDefaults,
	enrichRule,
	nestedSituationToPathMap
} from 'Engine/rules'
import { analyseMany, parseAll } from 'Engine/traverse.js'
import { safeLoad } from 'js-yaml'
import { rulesFr } from 'Règles'

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
			? do {
					let { base, extra } = config
					;[
						...(base ? enrichRules(base) : rulesFr),
						...(extra ? enrichRules(extra) : [])
					]
			  }
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
