import {
	convertToDate,
	getDifferenceInDays,
	getDifferenceInMonths,
	getDifferenceInYears,
	getRelativeDate,
	getYear,
} from './date'
import { Unit, Evaluation, Types, ASTNode, EvaluatedNode } from './AST/types'

export type Period<T> = {
	start: T | null
	end: T | null
}

export function parsePeriod<Date>(word: string, date: Date): Period<Date> {
	const startWords = [
		'depuis',
		'depuis le',
		'depuis la',
		'à partir de',
		'à partir du',
		'du',
	]
	const endWords = [
		"jusqu'à",
		"jusqu'au",
		"jusqu'à la",
		'avant',
		'avant le',
		'avant la',
		'au',
	]
	const intervalWords = ['le', 'en']
	if (!startWords.concat(endWords, intervalWords).includes(word)) {
		throw new SyntaxError(
			`Le mot clé '${word}' n'est pas valide. Les mots clés possible sont les suivants :\n\t ${startWords.join(
				', '
			)}`
		)
	}
	if (word === 'le') {
		return {
			start: date,
			end: date,
		}
	}
	if (word === 'en') {
		return { start: null, end: null }
	}
	if (startWords.includes(word)) {
		return {
			start: date,
			end: null,
		}
	}
	if (endWords.includes(word)) {
		return {
			start: null,
			end: date,
		}
	}
	throw new Error('Non implémenté')
}

export type TemporalNode = Temporal<EvaluatedNode & { nodeValue: number }>
export type Temporal<T> = Array<Period<string> & { value: T }>

export function narrowTemporalValue<T extends Types>(
	period: Period<string>,
	temporalValue: Temporal<Evaluation<T>>
): Temporal<Evaluation<T>> {
	return liftTemporal2(
		(value, filter) => filter && value,
		temporalValue,
		createTemporalEvaluation(true, period)
	)
}

// Returns a temporal value that's true for the given period and false otherwise.
export function createTemporalEvaluation<T extends Types>(
	value: Evaluation<T>,
	period: Period<string> = { start: null, end: null }
): Temporal<Evaluation<T>> {
	const temporalValue = [{ ...period, value }]
	if (period.start != null) {
		temporalValue.unshift({
			start: null,
			end: getRelativeDate(period.start, -1),
			value: false,
		})
	}
	if (period.end != null) {
		temporalValue.push({
			start: getRelativeDate(period.end, 1),
			end: null,
			value: false,
		})
	}
	return temporalValue
}

export function pureTemporal<T>(value: T): Temporal<T> {
	return [{ start: null, end: null, value }]
}

export function mapTemporal<T1, T2>(
	fn: (value: T1) => T2,
	temporalValue: Temporal<T1>
): Temporal<T2> {
	return temporalValue.map(({ start, end, value }) => ({
		start,
		end,
		value: fn(value),
	}))
}
export function sometime<T1>(
	fn: (value: T1) => boolean,
	temporalValue: Temporal<T1>
): boolean {
	return temporalValue.some(({ start, end, value }) => fn(value))
}

export function liftTemporal2<T1, T2, T3>(
	fn: (value1: T1, value2: T2) => T3,
	temporalValue1: Temporal<T1>,
	temporalValue2: Temporal<T2>
): Temporal<T3> {
	return mapTemporal(
		([a, b]) => fn(a, b),
		zipTemporals(temporalValue1, temporalValue2)
	)
}

export function concatTemporals<T, U>(
	temporalValues: Array<Temporal<T>>
): Temporal<Array<T>> {
	return temporalValues.reduce(
		(values, value) => liftTemporal2((a, b) => [...a, b], values, value),
		pureTemporal([]) as Temporal<Array<T>>
	)
}

export function liftTemporalNode<N extends ASTNode>(
	node: N
): Temporal<Pick<N, Exclude<keyof N, 'temporalValue'>>> {
	if (!('temporalValue' in node)) {
		return pureTemporal(node)
	}
	const { temporalValue, ...baseNode } = node as N & {
		temporalValue: Temporal<Evaluation<number>>
	}
	return mapTemporal(
		(nodeValue) => ({
			...baseNode,
			nodeValue,
		}),
		temporalValue
	)
}

export function zipTemporals<T1, T2>(
	temporalValue1: Temporal<T1>,
	temporalValue2: Temporal<T2>,
	acc: Temporal<[T1, T2]> = []
): Temporal<[T1, T2]> {
	if (!temporalValue1.length && !temporalValue2.length) {
		return acc
	}
	const [value1, ...rest1] = temporalValue1
	const [value2, ...rest2] = temporalValue2
	console.assert(value1.start === value2.start)
	const endDateComparison = compareEndDate(value1.end, value2.end)

	// End dates are equals
	if (endDateComparison === 0) {
		return zipTemporals(rest1, rest2, [
			...acc,
			{ ...value1, value: [value1.value, value2.value] },
		])
	}
	// Value1 lasts longuer than value1
	if (endDateComparison > 0) {
		console.assert(value2.end !== null)
		return zipTemporals(
			[
				{ ...value1, start: getRelativeDate(value2.end as string, 1) },
				...rest1,
			],
			rest2,
			[
				...acc,
				{
					...value2,
					value: [value1.value, value2.value],
				},
			]
		)
	}

	// Value2 lasts longuer than value1
	if (endDateComparison < 0) {
		console.assert(value1.end !== null)
		return zipTemporals(
			rest1,
			[
				{ ...value2, start: getRelativeDate(value1.end as string, 1) },
				...rest2,
			],
			[
				...acc,
				{
					...value1,
					value: [value1.value, value2.value],
				},
			]
		)
	}
	throw new EvalError('All case should have been covered')
}

function beginningOfNextYear(date: string): string {
	return `01/01/${getYear(date) + 1}`
}

function endsOfPreviousYear(date: string): string {
	return `31/12/${getYear(date) - 1}`
}

function splitStartsAt<T>(
	fn: (date: string) => string,
	temporal: Temporal<T>
): Temporal<T> {
	return temporal.reduce((acc, period) => {
		const { start, end } = period
		const newStart = start === null ? start : fn(start)
		if (compareEndDate(newStart, end) !== -1) {
			return [...acc, period]
		}
		console.assert(newStart !== null)
		return [
			...acc,
			{ ...period, end: getRelativeDate(newStart as string, -1) },
			{ ...period, start: newStart },
		]
	}, [] as Temporal<T>)
}

function splitEndsAt<T>(
	fn: (date: string) => string,
	temporal: Temporal<T>
): Temporal<T> {
	return temporal.reduce((acc, period) => {
		const { start, end } = period
		const newEnd = end === null ? end : fn(end)
		if (compareStartDate(start, newEnd) !== -1) {
			return [...acc, period]
		}
		console.assert(newEnd !== null)
		return [
			...acc,
			{ ...period, end: newEnd },
			{ ...period, start: getRelativeDate(newEnd as string, 1) },
		]
	}, [] as Temporal<T>)
}

export function groupByYear<T>(temporalValue: Temporal<T>): Array<Temporal<T>> {
	return (
		// First step: split period by year if needed
		splitEndsAt(
			endsOfPreviousYear,
			splitStartsAt(beginningOfNextYear, temporalValue)
		)
			// Second step: group period by year
			.reduce((acc, period) => {
				const [currentTemporal, ...otherTemporal] = acc
				if (currentTemporal === undefined) {
					return [[period]]
				}
				const firstPeriod = currentTemporal[0]
				console.assert(
					firstPeriod !== undefined &&
						firstPeriod.end !== null &&
						period.start !== null,
					'invariant non verifié'
				)
				if (
					(firstPeriod.end as string).slice(-4) !==
					(period.start as string).slice(-4)
				) {
					return [[period], ...acc]
				}
				return [[...currentTemporal, period], ...otherTemporal]
			}, [] as Array<Temporal<T>>)
			.reverse()
	)
}

function simplify<T>(temporalValue: Temporal<T>): Temporal<T> {
	return temporalValue
}

function compareStartDate(
	dateA: string | null,
	dateB: string | null
): -1 | 0 | 1 {
	if (dateA == dateB) {
		return 0
	}
	if (dateA == null) {
		return -1
	}
	if (dateB == null) {
		return 1
	}
	return convertToDate(dateA) < convertToDate(dateB) ? -1 : 1
}

function compareEndDate(
	dateA: string | null,
	dateB: string | null
): -1 | 0 | 1 {
	if (dateA == dateB) {
		return 0
	}
	if (dateA == null) {
		return 1
	}
	if (dateB == null) {
		return -1
	}
	return convertToDate(dateA) < convertToDate(dateB) ? -1 : 1
}

export function temporalAverage(
	temporalValue: Temporal<Evaluation<number>>,
	unit?: Unit
): Evaluation<number> {
	temporalValue = temporalValue.filter(({ value }) => value !== false)
	if (!temporalValue.length) {
		return false
	}
	if (temporalValue.length === 1) {
		return temporalValue[0].value
	}

	if (temporalValue.some(({ value }) => value == null)) {
		return null
	}

	const temporalNumber = temporalValue as Temporal<number>
	const first = temporalNumber[0]
	const last = temporalNumber[temporalNumber.length - 1]

	// La variable est définie sur un interval infini
	if (first.start == null || last.end == null) {
		if (first.start != null) {
			return last.value
		}
		if (last.end != null) {
			return first.value
		}
		return (first.value + last.value) / 2
	}

	let totalWeight = 0
	const weights = temporalNumber.map(({ start, end, value }) => {
		;[start, end] = [start, end] as [string, string]
		let weight = 0
		if (unit?.denominators.includes('mois')) {
			weight = getDifferenceInMonths(start, end)
		} else if (unit?.denominators.includes('année')) {
			weight = getDifferenceInYears(start, end)
		} else {
			weight = getDifferenceInDays(start, end)
		}
		totalWeight += weight
		return value * weight
	})
	return weights.reduce(
		(average, weightedValue) => average + weightedValue / totalWeight,
		0
	)
}

export function temporalCumul(
	temporalValue: Temporal<Evaluation<number>>,
	unit: Unit
): Evaluation<number> {
	temporalValue = temporalValue.filter(({ value }) => value !== false)
	if (!temporalValue.length) {
		return false
	}

	if (temporalValue.some(({ value }) => value == null)) {
		return null
	}

	const temporalNumber = temporalValue as Temporal<number>
	const first = temporalNumber[0]
	const last = temporalNumber[temporalNumber.length - 1]

	// La variable est définie sur un interval infini
	if (first.start == null || last.end == null) {
		if (first.start != null) {
			return !last.value ? last.value : last.value > 0 ? Infinity : -Infinity
		}
		if (last.end != null) {
			return !last.value ? last.value : last.value > 0 ? Infinity : -Infinity
		}
		return null
	}
	if (temporalNumber.some(({ value }) => value == null)) {
		return null
	}

	return temporalNumber.reduce((acc, { start, end, value }) => {
		;[start, end] = [start, end] as [string, string]
		let weight = 1
		if (unit?.denominators.includes('mois')) {
			weight = getDifferenceInMonths(start, end)
		} else if (unit?.denominators.includes('année')) {
			weight = getDifferenceInYears(start, end)
		} else if (unit?.denominators.includes('jour')) {
			weight = getDifferenceInDays(start, end)
		}
		return value * weight + acc
	}, 0)
}
