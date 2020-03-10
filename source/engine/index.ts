import { safeLoad } from 'js-yaml'
import { Simulation } from 'Reducers/rootReducer'
import { DottedName, Rule } from 'Types/rule'
import { evaluateNode } from './evaluation'
import { collectDefaults, enrichRule, rulesFr } from './rules'
import { parseAll } from './traverse'
import { parseUnit } from './units'

const emptyCache = {
	_meta: { contextRule: [], defaultUnits: [] }
}

type EngineConfig = {
	rules?: string | Array<any> | object
	extra?: string | Array<any> | object
}

let enrichRules = input => {
	const rules = typeof input === 'string' ? safeLoad(input) : input
	const rulesList = Array.isArray(rules)
		? rules
		: Object.entries(rules).map(([dottedName, rule]) => ({
				dottedName,
				...(rule as any)
		  }))
	return rulesList.map(enrichRule)
}

export default class Engine {
	parsedRules: Record<DottedName, Rule>
	defaultValues: Simulation['situation']
	situation: Simulation['situation'] = {}
	cache = { ...emptyCache }

	constructor(config: EngineConfig = {}) {
		const rules = config
			? [
					...(config.rules ? enrichRules(config.rules) : rulesFr),
					...(config.extra ? enrichRules(config.extra) : [])
			  ]
			: rulesFr
		this.parsedRules = parseAll(rules) as any
		this.defaultValues = collectDefaults(rules)
	}

	private resetCache() {
		this.cache = { ...emptyCache }
	}

	setSituation(situation: Simulation['situation'] = {}) {
		this.situation = situation
		this.resetCache()
	}

	setDefaultUnits(defaultUnits = []) {
		this.cache._meta.defaultUnits = defaultUnits.map(unit =>
			parseUnit(unit)
		) as any
	}

	evaluate(expression: string | Array<string>) {
		const results = (Array.isArray(expression) ? expression : [expression]).map(
			expr =>
				this.cache[expr] ||
				(this.parsedRules[expr]
					? evaluateNode(
							this.cache,
							this.situationGate,
							this.parsedRules,
							this.parsedRules[expr]
							// TODO: To support expressions (with operations, unit conversion,
							// etc.) it should be enough to replace the above line with :
							// parse(this.parsedRules, { dottedName: '' }, this.parsedRules)(expr)
							// But currently there are small side effects (null values converted
							// to 0), so we need to modify a little bit the engine before enabling
							// publicode expressions in the UI.
					  )
					: null)
		)

		return Array.isArray(expression) ? results : results[0]
	}

	situationGate = (dottedName: string) =>
		this.situation[dottedName] || this.defaultValues[dottedName]
}
