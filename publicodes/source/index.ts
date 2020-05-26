import { mapObjIndexed } from 'ramda'
import { evaluateControls } from './controls'
import { evaluationError, warning } from './error'
import { collectDefaults, evaluateNode } from './evaluation'
import { convertNodeToUnit, simplifyNodeUnit } from './nodeUnits'
import { parse } from './parse'
import parseRules from './parseRules'
import { EvaluatedNode, EvaluatedRule, ParsedRules, Rules } from './types'
import { parseUnit } from './units'

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
type Situation<Names extends string> = Partial<
	Record<Names, object | string | number>
>

type EvaluatedSituation<Names extends string> = Partial<
	Record<Names, object | number | EvaluatedNode<Names>>
>

export type EvaluationOptions = Partial<{
	unit: string
	useDefaultValues: boolean
}>

export * from './components'
export { formatValue } from './format'
export { default as translateRules } from './translateRules'
export * from './types'
export { parseRules }

export default class Engine<Names extends string> {
	parsedRules: ParsedRules<Names>
	defaultValues: Situation<Names>
	situation: Situation<Names> = {}
	cache: Cache
	warnings: Array<string> = []
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
		) as EvaluatedSituation<Names>
	}

	private resetCache() {
		this.cache = emptyCache()
		this.cacheWithoutDefault = emptyCache()
	}

	private situationWithDefaultValues(useDefaultValues = true) {
		return {
			...(useDefaultValues ? this.defaultValues : {}),
			...this.situation
		}
	}

	private evaluateExpression(
		expression: string,
		context: string,
		useDefaultValues = true
	): EvaluatedNode<Names> {
		// EN ATTENDANT d'AVOIR une meilleure gestion d'erreur, on va mocker
		// console.warn
		const warnings: string[] = []
		const originalWarn = console.warn
		console.warn = (warning: string) => {
			this.warnings.push(warning)
			originalWarn(warning)
		}
		const result = simplifyNodeUnit(
			evaluateNode(
				useDefaultValues ? this.cache : this.cacheWithoutDefault,
				this.situationWithDefaultValues(useDefaultValues),
				this.parsedRules,
				parse(
					this.parsedRules,
					{ dottedName: context },
					this.parsedRules
				)(expression)
			)
		)
		console.warn = originalWarn

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
		) as EvaluatedSituation<Names>
		return this
	}

	evaluate(expression: Names, options?: EvaluationOptions): EvaluatedRule<Names>
	evaluate(
		expression: string,
		options?: EvaluationOptions
	): EvaluatedNode<Names> | EvaluatedRule<Names>
	evaluate(expression: string, options?: EvaluationOptions) {
		let result = this.evaluateExpression(
			expression,
			`[evaluation] ${expression}`,
			options?.useDefaultValues ?? true
		)
		if (result.category === 'reference' && result.explanation) {
			result = {
				nodeValue: result.nodeValue,
				...('unit' in result && { unit: result.unit }),
				...('temporalValue' in result && {
					temporalValue: result.temporalValue
				}),
				...result.explanation
			} as EvaluatedRule<Names>
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
		return evaluateControls(
			this.cache,
			this.situationWithDefaultValues(),
			this.parsedRules
		)
	}

	getWarnings() {
		return this.warnings
	}

	inversionFail(): boolean {
		return !!this.cache._meta.inversionFail
	}

	getParsedRules(): ParsedRules<Names> {
		return this.parsedRules
	}
}
