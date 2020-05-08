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
	zipWith
} from 'ramda'
import { useSelector } from 'react-redux'
import { useEvaluation } from './EngineContext'
import {
	objectifsSelector,
	configSelector,
	answeredQuestionsSelector,
	currentQuestionSelector,
	situationSelector
} from 'Selectors/simulationSelectors'
import { useMemo } from 'react'
import { DottedName } from 'Rules'
import { Simulation, SimulationConfig } from 'Reducers/rootReducer'

type MissingVariables = Array<Partial<Record<DottedName, number>>>
export function getNextSteps(
	missingVariables: MissingVariables
): Array<DottedName> {
	const byCount = ([, [count]]) => count
	const byScore = ([, [, score]]) => score

	const missingByTotalScore = reduce(mergeWith(add), {}, missingVariables)

	const innerKeys = flatten(map(keys, missingVariables)),
		missingByTargetsAdvanced = countBy(identity, innerKeys)

	const missingByCompound = mergeWith(
			pair,
			missingByTargetsAdvanced,
			missingByTotalScore
		),
		pairs = toPairs(missingByCompound),
		sortedPairs = sortWith([descend(byCount), descend(byScore) as any], pairs)
	return map(head, sortedPairs)
}

const similarity = (rule1 = '', rule2 = '') =>
	pipe(
		zipWith(equals),
		takeWhile(Boolean),
		length,
		negate
	)(rule1.split(' . '), rule2.split(' . '))

export function getNextQuestions(
	missingVariables: MissingVariables,
	questionConfig: SimulationConfig['questions'] = {},
	answeredQuestions: Array<DottedName> = [],
	situation: Simulation['situation'] = {}
): Array<DottedName> {
	const {
		'non prioritaires': notPriority = [],
		uniquement: only = null,
		'liste noire': blacklist = []
	} = questionConfig
	let nextSteps = difference(getNextSteps(missingVariables), answeredQuestions)

	if (only) {
		nextSteps = intersection(nextSteps, [...only, ...notPriority])
	}
	if (blacklist) {
		nextSteps = difference(nextSteps, blacklist)
	}

	const lastStep = last(answeredQuestions)
	// L'ajout de la réponse permet de traiter les questions dont la réponse est "une possibilité", exemple "contrat salarié . cdd"
	const lastStepWithAnswer =
		lastStep && situation[lastStep]
			? ([lastStep, situation[lastStep]]
					.join(' . ')
					.replace(/'/g, '')
					.trim() as DottedName)
			: lastStep

	return sortBy(
		question =>
			notPriority.includes(question)
				? notPriority.indexOf(question)
				: similarity(question, lastStepWithAnswer),

		nextSteps
	)
}

export const useNextQuestions = function(): Array<DottedName> {
	const objectifs = useSelector(objectifsSelector)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const questionsConfig = useSelector(configSelector).questions ?? {}
	const situation = useSelector(situationSelector)
	const missingVariables = useEvaluation(objectifs, {
		useDefaultValues: false
	}).map(node => node.missingVariables ?? {})
	const nextQuestions = useMemo(() => {
		return getNextQuestions(
			missingVariables,
			questionsConfig,
			answeredQuestions,
			situation
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
