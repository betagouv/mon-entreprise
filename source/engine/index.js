// This file exports the functions of the public computing library
import { safeLoad } from 'js-yaml'
import { collectDefaults, enrichRule, rulesFr } from './rules'
import { analyseMany, parseAll } from './traverse.js'

// The public evaluation function takes a nested object of input values
let inputToStateSelector = rules => input => dottedName =>
	({
		...collectDefaults(rules),
		...input
	}[dottedName])

let enrichRules = input => {
	const rules = typeof input === 'string' ? safeLoad(input) : input
	const rulesList = Array.isArray(rules)
		? rules
		: Object.entries(rules).map(([dottedName, rule]) => ({
				dottedName,
				...rule
		  }))
	return rulesList.map(enrichRule)
}

export default {
	evaluate: (targetInput, input, config) => {
		let rules = config
			? [
					...(config.base ? enrichRules(config.base) : rulesFr),
					...(config.extra ? enrichRules(config.extra) : [])
			  ]
			: rulesFr

		let evaluation = analyseMany(
			parseAll(rules),
			Array.isArray(targetInput) ? targetInput : [targetInput]
		)(inputToStateSelector(rules)(input))
		if (config?.debug) return evaluation

		let values = evaluation.targets.map(t => t.nodeValue)

		return Array.isArray(targetInput) ? values : values[0]
	}
}
