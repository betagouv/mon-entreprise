import { evaluateControls } from 'Engine/controls'
import { Simulation } from 'Reducers/rootReducer'
import { Rule } from 'Types/rule'
import { DottedName } from './../types/rule'
import { evaluateNode } from './evaluation'
import parseRules from './parseRules'
import { collectDefaults } from './ruleUtils'
import { parseUnit, Unit } from './units'

const emptyCache = {
	_meta: { contextRule: [], defaultUnits: [] }
}

type EngineConfig = {
	rules: string | object
	useDefaultValues?: boolean
}

type Cache = {
	_meta: {
		contextRule: Array<string>
		defaultUnits: Array<Unit>
		inversionFail?: {
			given: string
			estimated: string
		}
	}
}

export { default as translateRules } from './translateRules'
export { parseRules }
export default class Engine {
	parsedRules: Record<DottedName, Rule>
	defaultValues: Simulation['situation']
	situation: Simulation['situation'] = {}
	cache: Cache = { ...emptyCache }

	constructor({ rules, useDefaultValues = true }: EngineConfig) {
		this.parsedRules =
			typeof rules === 'object' &&
			!!Object.values(rules).filter(Boolean)[0].dottedName
				? rules
				: (parseRules(rules) as any)
		this.defaultValues = useDefaultValues
			? collectDefaults(this.parsedRules)
			: {}
	}

	private resetCache() {
		this.cache = { ...emptyCache }
	}

	setSituation(situation: Simulation['situation'] = {}) {
		this.situation = situation
		this.resetCache()
		return this
	}

	setDefaultUnits(defaultUnits: string[] = []) {
		this.cache._meta.defaultUnits = defaultUnits.map(unit =>
			parseUnit(unit)
		) as any
		return this
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
					  )
					: // TODO: To support expressions (with operations, unit conversion,
					  // etc.) it should be enough to replace the above line with :
					  // parse(this.parsedRules, { dottedName: '' }, this.parsedRules)(expr)
					  // But currently there are small side effects (null values converted
					  // to 0), so we need to modify a little bit the engine before enabling
					  // publicode expressions in the UI.

					  null)
		)
		return Array.isArray(expression) ? results : results[0]
	}
	controls() {
		return evaluateControls(this.cache, this.situationGate, this.parsedRules)
	}
	// TODO : this should be private
	getCache(): Cache {
		return this.cache
	}
	situationGate = (dottedName: string) =>
		this.situation[dottedName] ?? this.defaultValues[dottedName]
}
