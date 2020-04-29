import { evaluateControls } from 'Engine/controls'
import { convertNodeToUnit, simplifyNodeUnit } from 'Engine/nodeUnits'
import { parse } from 'Engine/parse'
import { EvaluatedNode, EvaluatedRule, ParsedRules, Rules } from 'Engine/types'
import { parseUnit } from 'Engine/units'
import { mapObjIndexed } from 'ramda'
import { Simulation } from 'Reducers/rootReducer'
import { evaluationError, warning } from './error'
import { collectDefaults, evaluateNode } from './evaluation'
import parseRules from './parseRules'

const emptyCache = () => ({
	_meta: { contextRule: [] }
})

type Cache = {
	_meta: {
		contextRule: Array<string>
		inversionFail?: {
			given: string
			estimated: string
		}
	}
}

export type EvaluationOptions = Partial<{
	unit: string
	useDefaultValues: boolean
}>

export { default as translateRules } from './translateRules'
export { parseRules }
export default class Engine<Names extends string> {
	parsedRules: ParsedRules<Names>
	defaultValues: Simulation['situation']
	situation: Simulation['situation'] = {}
	cache: Cache
	cacheWithoutDefault: Cache

	constructor(rules: string | Rules<Names> | ParsedRules<Names>) {
		this.cache = emptyCache()
		this.cacheWithoutDefault = emptyCache()
		this.parsedRules =
			typeof rules === 'string' || !(Object.values(rules)[0] as any)?.dottedName
				? parseRules(rules)
				: (rules as ParsedRules<Names>)

		this.defaultValues = mapObjIndexed(
			(value, name) =>
				typeof value === 'string'
					? this.evaluateExpression(value, `[valeur par défaut] ${name}`, false)
					: value,
			collectDefaults(this.parsedRules)
		)
	}

	private resetCache() {
		this.cache = emptyCache()
		this.cacheWithoutDefault = emptyCache()
	}

	private situationGate(useDefaultValues = true) {
		return dottedName =>
			this.situation[dottedName] ??
			(useDefaultValues ? this.defaultValues[dottedName] : null)
	}

	private evaluateExpression(
		expression: string,
		context: string,
		useDefaultValues: boolean = true
	): EvaluatedRule<Names> {
		const result = simplifyNodeUnit(
			evaluateNode(
				useDefaultValues ? this.cache : this.cacheWithoutDefault,
				this.situationGate(useDefaultValues),
				this.parsedRules,
				parse(
					this.parsedRules,
					{ dottedName: context },
					this.parsedRules
				)(expression)
			)
		)

		if (Object.keys(result.defaultValue?.missingVariable ?? {}).length) {
			throw evaluationError(
				context,
				"Impossible d'évaluer l'expression car celle ci fait appel à des variables manquantes"
			)
		}
		return result
	}

	setSituation(
		situation: Partial<Record<Names, string | number | object>> = {}
	) {
		this.resetCache()
		this.situation = mapObjIndexed(
			(value, name) =>
				typeof value === 'string'
					? this.evaluateExpression(value, `[situation] ${name}`, true)
					: value,
			situation
		)
		return this
	}

	evaluate(expression: Names, options?: EvaluationOptions): EvaluatedRule<Names>
	evaluate(
		expression: string,
		options?: EvaluationOptions
	): EvaluatedNode<Names>
	evaluate(
		expression: string,
		options?: EvaluationOptions
	): EvaluatedNode<Names> {
		let result = this.evaluateExpression(
			expression,
			`[evaluation] ${expression}`,
			options?.useDefaultValues ?? true
		)
		if (result.category === 'reference' && result.explanation) {
			result = {
				nodeValue: result.nodeValue,
				unit: result.unit,
				...('temporalValue' in result && {
					temporalValue: result.temporalValue
				}),
				...result.explanation
			}
		}
		if (options?.unit) {
			try {
				return convertNodeToUnit(
					parseUnit(options.unit),
					result as EvaluatedNode<Names, number>
				)
			} catch (e) {
				warning(
					`[evaluation] ${expression}`,
					"L'unité demandée est incompatible avec l'expression évaluée"
				)
			}
		}
		return result
	}
	controls() {
		return evaluateControls(this.cache, this.situationGate(), this.parsedRules)
	}

	inversionFail(): boolean {
		return !!this.cache._meta.inversionFail
	}

	getParsedRules(): ParsedRules<Names> {
		return this.parsedRules
	}

	// TODO : this should be private
	getCache(): Cache {
		return this.cache
	}
}
