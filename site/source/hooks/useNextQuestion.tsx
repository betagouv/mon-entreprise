import { useWorkerEngine, WorkerEngine } from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import Engine, { RuleNode } from 'publicodes'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { SimulationConfig } from '@/store/reducers/rootReducer'
import {
	answeredQuestionsSelector,
	configSelector,
	useMissingVariables,
} from '@/store/selectors/simulationSelectors'
import { ImmutableType } from '@/types/utils'

import { usePromise } from './usePromise'

// import { useEngine } from '../components/utils/EngineContext'

type MissingVariables = Partial<Record<DottedName, number>>

// Max : 1
// Min -> 0
const questionDifference = (ruleA = '', ruleB = '') => {
	if (ruleA === ruleB) {
		return 0
	}
	const partsA = ruleA.split(' . ')
	const partsB = ruleB.split(' . ')

	return 1 / (1 + partsA.findIndex((val, i) => partsB?.[i] !== val))
}

export function getNextQuestions(
	missingVariables: MissingVariables,
	questionConfig: ImmutableType<SimulationConfig['questions']> = {},
	answeredQuestions: Array<DottedName> = []
): Array<DottedName> {
	const {
		'non prioritaires': notPriority = [],
		liste: whitelist = [],
		'liste noire': blacklist = [],
	} = questionConfig

	const nextSteps = Object.entries(missingVariables)
		.sort(([, a], [, b]) => b - a)
		.map(([a]) => a as DottedName)
		.filter((name) => !answeredQuestions.includes(name))
		.filter(
			(step) =>
				(!whitelist.length ||
					whitelist.some((name) => step.startsWith(name))) &&
				(!blacklist.length || !blacklist.some((name) => step === name))
		)

	const score = (question: string) => {
		const indexList =
			whitelist.findIndex((name) => question.startsWith(name)) + 1
		const indexNotPriority =
			notPriority.findIndex((name) => question.startsWith(name)) + 1
		const differenceCoeff = questionDifference(
			question,
			answeredQuestions.slice(-1)[0]
		)

		return indexList + indexNotPriority + differenceCoeff
	}

	// The higher the score, the less important the question
	return nextSteps.sort((a, b) => score(a) - score(b))
}

export const useNextQuestions = function (
	workerEngines?: WorkerEngine[]
): Array<DottedName> {
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const config = useSelector(configSelector)
	const workerEngine = useWorkerEngine()
	const missingVariables = useMissingVariables(workerEngines)

	const nextQuestions = usePromise(
		async () => {
			const next = getNextQuestions(
				missingVariables,
				config.questions ?? {},
				answeredQuestions
			)

			const rules = await Promise.all(
				next.map((question) => workerEngine.asyncGetRule(question))
			)

			return next.filter((_, i) => rules[i].rawNode.question !== undefined)
		},
		[missingVariables, config.questions, answeredQuestions, workerEngine],
		[] as DottedName[]
	)

	return nextQuestions
}

export function useSimulationProgress(): {
	progressRatio: number
	numberCurrentStep: number
	numberSteps: number
} {
	const numberQuestionAnswered = useSelector(answeredQuestionsSelector).length
	const numberQuestionLeft = useNextQuestions().length

	return {
		progressRatio:
			numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft),
		numberCurrentStep: numberQuestionAnswered,
		numberSteps: numberQuestionAnswered + numberQuestionLeft,
	}
}
