import { convertToString, getYear } from 'Engine/date'
import { evaluationError } from 'Engine/error'
import { evaluateNode } from 'Engine/evaluation'
import { Evaluation } from 'Engine/types'
import {
	createTemporalEvaluation,
	groupByYear,
	liftTemporal2,
	pureTemporal,
	Temporal,
	temporalAverage,
	temporalCumul
} from 'Engine/temporal'
import { Unit } from 'Engine/units'
import { coerceArray } from '../../utils'
import { DottedName } from './../../rules/index'

function stripTemporalTransform(node) {
	if (!node?.explanation?.period) {
		return node
	}
	return stripTemporalTransform(node.explanation.value)
}
export default function parse(parse, k, v) {
	const rule = parse(v.règle)
	if (!v['valeurs cumulées']) {
		throw new Error(
			'Il manque la clé `valeurs cumulées` dans le mécanisme régularisation'
		)
	}

	const variables = coerceArray(v['valeurs cumulées']).map(variable => {
		if (typeof variable !== 'string') {
			throw new Error(
				'Les `valeurs cumulées` du mécanisme de régularisation doivent être des noms de règles existantes'
			)
		}

		const value = parse(variable)
		const reference = stripTemporalTransform(value)
		if (reference.category !== 'reference') {
			throw new Error(
				'Le mécanisme régularisation attend des noms de règles existantes dans les `valeurs cumulées`'
			)
		}
		return { value, dottedName: reference.dottedName }
	}) as Array<{ dottedName: DottedName; value: object }>

	return {
		evaluate,
		explanation: {
			rule,
			variables
		},
		category: 'mecanism',
		name: 'taux progressif',
		type: 'numeric',
		unit: rule.unit
	}
}

function getMonthlyCumulatedValuesOverYear(
	year: number,
	variable: Temporal<Evaluation<number>>,
	unit: Unit
): Temporal<Evaluation<number>> {
	const start = convertToString(new Date(year, 0, 1))
	const cumulatedPeriods = [...Array(12).keys()]
		.map(monthNumber => ({
			start,
			end: convertToString(new Date(year, monthNumber + 1, 0))
		}))
		.map(period => {
			const temporal = liftTemporal2(
				(filter, value) => filter && value,
				createTemporalEvaluation(true, period),
				variable
			)
			return {
				...period,
				value: temporalCumul(temporal, unit)
			}
		})

	return cumulatedPeriods
}

function evaluate(
	cache,
	situation,
	parsedRules,
	node: ReturnType<typeof parse>
) {
	const evaluate = evaluateNode.bind(null, cache, situation, parsedRules)

	function recalculWith(situationGate: (dottedName: DottedName) => any, node) {
		const newSituation = (dottedName: DottedName) =>
			situationGate(dottedName) ?? situation(dottedName)
		return evaluateNode({ _meta: cache._meta }, newSituation, parsedRules, node)
	}

	function regulariseYear(temporalEvaluation: Temporal<Evaluation<number>>) {
		if (temporalEvaluation.filter(({ value }) => value !== false).length <= 1) {
			return temporalEvaluation
		}

		const currentYear = getYear(temporalEvaluation[0].start as string)
		const cumulatedVariables = node.explanation.variables.reduce(
			(acc, { dottedName, value }) => {
				const evaluation = evaluate(value)
				if (!evaluation.unit.denominators.some(unit => unit === 'mois')) {
					evaluationError(
						cache._meta.contextRule,
						`Dans le mécanisme régularisation, la valeur cumulée '${dottedName}' n'est pas une variable numérique définie sur le mois`
					)
				}
				return {
					...acc,
					[dottedName]: getMonthlyCumulatedValuesOverYear(
						currentYear,
						evaluation.temporalValue ?? pureTemporal(evaluation.nodeValue),
						evaluation.unit
					)
				}
			},
			{}
		)

		const cumulatedMonthlyEvaluations = [...Array(12).keys()].map(i => ({
			start: convertToString(new Date(currentYear, i, 1)),
			end: convertToString(new Date(currentYear, i + 1, 0)),
			value: recalculWith(
				dottedName => cumulatedVariables[dottedName]?.[i].value,
				node.explanation.rule
			).nodeValue
		}))
		const temporalRégularisée = cumulatedMonthlyEvaluations.map(
			(period, i) => ({
				...period,
				value: period.value - (cumulatedMonthlyEvaluations[i - 1]?.value ?? 0)
			})
		)

		return temporalRégularisée as Temporal<Evaluation<number>>
	}

	const evaluation = evaluate(node.explanation.rule)
	const temporalValue = evaluation.temporalValue
	const evaluationWithRegularisation = groupByYear(
		temporalValue as Temporal<Evaluation<number>>
	)
		.map(regulariseYear)
		.flat()
	return {
		...node,
		temporalValue: evaluationWithRegularisation,
		explanation: evaluation,
		nodeValue: temporalAverage(evaluationWithRegularisation, evaluation.unit),
		missingVariables: evaluation.missingVariables,
		unit: evaluation.unit
	}
}
