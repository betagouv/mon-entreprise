// This file exports the functions of the public computing library
import { safeLoad } from 'js-yaml'
import { collectDefaults, enrichRule, rulesFr } from './rules'
import { analyseMany, parseAll } from './traverse'

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

class Engine {
	situation = {}
	parsedRules
	constructor(rules = rulesFr) {
		this.parsedRules = parseAll(rules)
		this.defaultValues = collectDefaults(rules)
	}
	evaluate(targets, { defaultUnits, situation, withDefaultValues = true }) {
		this.evaluation = analyseMany(
			this.parsedRules,
			targets,
			defaultUnits
		)(
			dottedName =>
				situation[dottedName] ||
				(withDefaultValues && this.defaultValues[dottedName])
		)
		return this.evaluation.targets.map(({ nodeValue }) => nodeValue)
	}
	getLastEvaluationExplanations() {
		return this.evaluation
	}
}

export default {
	evaluate: (targetInput, input, config, defaultUnits = []) => {
		let rules = config
			? [
					...(config.base ? enrichRules(config.base) : rulesFr),
					...(config.extra ? enrichRules(config.extra) : [])
			  ]
			: rulesFr

		let evaluation = analyseMany(
			parseAll(rules),
			Array.isArray(targetInput) ? targetInput : [targetInput],
			defaultUnits
		)(inputToStateSelector(rules)(input))
		if (config?.debug) return evaluation

		let values = evaluation.targets.map(t => t.nodeValue)

		return Array.isArray(targetInput) ? values : values[0]
	},
	Engine
}
