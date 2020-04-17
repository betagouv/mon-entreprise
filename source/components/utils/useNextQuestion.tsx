import { splitName } from 'Engine/ruleUtils'
import {
	add,
	countBy,
	descend,
	difference,
	equals,
	flatten,
	head,
	identity,
	intersection,
	keys,
	last,
	length,
	map,
	mergeWith,
	negate,
	pair,
	pipe,
	reduce,
	sortBy,
	sortWith,
	takeWhile,
	toPairs,
	values,
	zipWith
} from 'ramda'
import { useSelector } from 'react-redux'
import { useEvaluation } from './EngineContext'
import {
	objectifsSelector,
	configSelector,
	answeredQuestionsSelector,
	currentQuestionSelector
} from 'Selectors/simulationSelectors'
import { useMemo } from 'react'
import { DottedName } from 'Rules'
import { SimulationConfig } from 'Reducers/rootReducer'

type MissingVariables = Array<Partial<Record<DottedName, number>>>
export function getNextSteps(
	missingVariables: MissingVariables
): Array<DottedName> {
	let byCount = ([, [count]]) => count
	let byScore = ([, [, score]]) => score

	let missingByTotalScore = reduce(mergeWith(add), {}, missingVariables)

	let innerKeys = flatten(map(keys, missingVariables)),
		missingByTargetsAdvanced = countBy(identity, innerKeys)

	let missingByCompound = mergeWith(
			pair,
			missingByTargetsAdvanced,
			missingByTotalScore
		),
		pairs = toPairs(missingByCompound),
		sortedPairs = sortWith([descend(byCount), descend(byScore) as any], pairs)
	return map(head, sortedPairs)
}

const similarity = (rule1: string = '', rule2: string = '') =>
	pipe(
		zipWith(equals),
		takeWhile(Boolean),
		length,
		negate
	)(splitName(rule1), splitName(rule2))

export function getNextQuestions(
	missingVariables: MissingVariables,
	questionConfig: SimulationConfig['questions'] = {},
	answeredQuestions = []
): Array<DottedName> {
	const {
		'non prioritaires': notPriority = [],
		uniquement: only = null,
		'liste noire': blacklist = []
	} = questionConfig
	// console.log(missingVariables)
	let nextSteps = difference(getNextSteps(missingVariables), answeredQuestions)

	if (only) {
		nextSteps = intersection(nextSteps, [...only, ...notPriority])
	}
	if (blacklist) {
		nextSteps = difference(nextSteps, blacklist)
	}

	const lastStep = last(answeredQuestions)
	// L'ajout de la réponse permet de traiter les questions dont la réponse est "une possibilité", exemple "contrat salarié . cdd"
	// lastStepWithAnswer =
	// 	lastStep && situation[lastStep]
	// 		? ([lastStep, situation[lastStep]].join(' . ') as DottedName)
	// 		: lastStep

	return sortBy(
		question =>
			notPriority.includes(question)
				? notPriority.indexOf(question)
				: similarity(question, lastStep),

		nextSteps
	)
}

export const useNextQuestions = function(): Array<DottedName> {
	const objectifs = useSelector(objectifsSelector)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const questionsConfig = useSelector(configSelector).questions ?? {}
	const missingVariables = useEvaluation(objectifs, {
		useDefaultValues: false
	}).map(node => node.missingVariables ?? {})
	const nextQuestions = useMemo(() => {
		return getNextQuestions(
			missingVariables,
			questionsConfig,
			answeredQuestions
		)
	}, [missingVariables, questionsConfig, answeredQuestions])
	if (currentQuestion && currentQuestion !== nextQuestions[0]) {
		return [currentQuestion, ...nextQuestions]
	}
	return nextQuestions
}

export function useSimulationProgress(): number {
	const numberQuestionAnswered = useSelector(answeredQuestionsSelector).length
	const numberQuestionLeft = useNextQuestions().length
	return numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft)
}
