import { evaluateControls } from 'Engine/controls'
import { ParsedRules, Rules } from 'Engine/types'
import { Simulation } from 'Reducers/rootReducer'
import { evaluateNode } from './evaluation'
import parseRules from './parseRules'
import { collectDefaults } from './ruleUtils'
import { parseUnit, Unit } from './units'

const emptyCache = {
	_meta: { contextRule: [], defaultUnits: [] }
}

type EngineConfig<Names extends string> = {
	rules: string | Rules<Names> | ParsedRules<Names>
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
export default class Engine<Names extends string> {
	parsedRules: ParsedRules<Names>
	defaultValues: Simulation['situation']
	situation: Simulation['situation'] = {}
	cache: Cache = { ...emptyCache }

	constructor({ rules, useDefaultValues = true }: EngineConfig<Names>) {
		this.parsedRules =
			typeof rules === 'string' || !(Object.values(rules)[0] as any)?.dottedName
				? parseRules(rules)
				: (rules as ParsedRules<Names>)
		this.defaultValues = useDefaultValues
			? collectDefaults(this.parsedRules)
			: {}
	}

	private resetCache() {
		this.cache = { ...emptyCache }
	}

	/**
	 * Permet de définir la situation
	 * @param situation Un dictionnaire qui associe le nom des règles avec leur valeur
	 */
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

	/**
	 *
	 * @param expression L'expression à évaluer
	 */
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
