import { SimulationConfig } from '@/reducers/rootReducer'
import {
	answeredQuestionsSelector,
	configSelector,
	currentQuestionSelector,
	useMissingVariables,
} from '@/selectors/simulationSelectors'
import { DottedName } from 'modele-social'
import { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { EngineContext } from './EngineContext'

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
	questionConfig: SimulationConfig['questions'] = {},
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

	return nextSteps.sort((a, b) => score(a) - score(b))
}

export const useNextQuestions = function (): Array<DottedName> {
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const questionsConfig = useSelector(configSelector).questions
	const engine = useContext(EngineContext)
	const missingVariables = useMissingVariables()
	const nextQuestions = useMemo(() => {
		let next = getNextQuestions(
			missingVariables,
			questionsConfig ?? {},
			answeredQuestions
		)
		if (currentQuestion && currentQuestion !== next[0]) {
			next = [currentQuestion, ...next.filter((val) => val !== currentQuestion)]
		}

		return next.filter(
			(question) =>
				engine.evaluate(question).nodeValue !== null &&
				engine.getRule(question).rawNode.question !== undefined
		)
	}, [
		missingVariables,
		questionsConfig,
		answeredQuestions,
		engine,
		currentQuestion,
	])

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
