import { convertToString, getYear } from 'Engine/date'
import { evaluationError } from 'Engine/error'
import { evaluateNode } from 'Engine/evaluation'
import {
	createTemporalEvaluation,
	Evaluation,
	groupByYear,
	liftTemporal2,
	Temporal,
	temporalAverage,
	temporalCumul
} from 'Engine/period'
import { Unit } from 'Engine/units'
import { DottedName } from 'Types/rule'
import { coerceArray } from '../../utils'

export default function parse(parse, k, v) {
	const rule = parse(v.règle)
	if (!v['valeurs cumulées']) {
		throw new Error(
			'Il manque la clé `valeurs cumulées` dans le mécanisme régularisation'
		)
	}

	const variables = coerceArray(v['valeurs cumulées']).map(parse) as Array<{
		dottedName: DottedName
		category: string
		name: 'string'
	}>
	if (variables.some(({ category }) => category !== 'reference')) {
		throw new Error(
			'Le mécanisme régularisation attend des noms de règles sous la clé `valeurs cumulées`'
		)
	}

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
			(acc, parsedVariable) => {
				const evaluation = evaluate(parsedVariable)
				if (!evaluation.temporalValue) {
					evaluationError(
						cache._meta.contextRule,
						`Dans le mécanisme régularisation, la valeur annuelle ${parsedVariable.name} n'est pas une variables temporelle`
					)
				}
				return {
					...acc,
					[parsedVariable.dottedName]: getMonthlyCumulatedValuesOverYear(
						currentYear,
						evaluation.temporalValue,
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
		nodeValue: temporalAverage(temporalValue),
		missingVariables: evaluation.missingVariables,
		unit: evaluation.unit
	}
}
