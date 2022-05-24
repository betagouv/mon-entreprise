import { Simulation, SimulationConfig } from '@/reducers/rootReducer'
import {
	answeredQuestionsSelector,
	configSelector,
	currentQuestionSelector,
	objectifsSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { DottedName } from 'modele-social'
import { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { EngineContext } from './EngineContext'

type MissingVariables = Partial<Record<DottedName, number>>

export function getNextSteps(
	missingVariables: Array<MissingVariables>
): Array<DottedName> {
	const missingByTotalScore = missingVariables.reduce<Record<string, number>>(
		(acc, mv) => ({
			...acc,
			...Object.fromEntries(
				Object.entries(mv).map(([name, score]) => [
					name,
					(acc[name] || 0) + score,
				])
			),
		}),
		{}
	)

	const innerKeys = missingVariables.map((mv) => Object.keys(mv)).flat()
	const missingByTargetsAdvanced = Object.fromEntries(
		Object.entries(
			innerKeys.reduce<Record<string, number>>(
				(counters, key) => ({
					...counters,
					[key]: (counters[key] ?? 0) + 1,
				}),
				{}
			)
		).map(
			// Give higher score to top level questions
			([name, score]) => [name, score + Math.max(0, 4 - name.split('.').length)]
		)
	)

	const missingByCompoundEntries = [
		...new Set([
			...Object.keys(missingByTargetsAdvanced),
			...Object.keys(missingByTotalScore),
		]),
	].map((name): [string, { score: number; count: number }] => [
		name,
		{
			count: missingByTargetsAdvanced[name] ?? 0,
			score: missingByTotalScore[name] ?? 0,
		},
	])

	const sortedEntries = missingByCompoundEntries.sort(
		([, scoresA], [, scoresB]) => {
			if (scoresA.count === scoresB.count) {
				return scoresB.score - scoresA.score
			} else {
				return scoresB.count - scoresA.count
			}
		}
	)

	return sortedEntries.map(([name]) => name) as Array<DottedName>
}

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
	missingVariables: Array<MissingVariables>,
	questionConfig: SimulationConfig['questions'] = {},
	answeredQuestions: Array<DottedName> = [],
	situation: Simulation['situation'] = {}
): Array<DottedName> {
	const {
		'non prioritaires': notPriority = [],
		liste: whitelist = [],
		'liste noire': blacklist = [],
		"à l'affiche": displayed = {},
	} = questionConfig

	const nextSteps = [
		...new Set([
			...Object.values(displayed),
			...getNextSteps(missingVariables),
		]),
	]
		.filter((name) => !answeredQuestions.includes(name))
		.filter(
			(step) =>
				(!whitelist.length ||
					whitelist.some((name) => step.startsWith(name))) &&
				(!blacklist.length || !blacklist.some((name) => step === name))
		)

	const lastStep = answeredQuestions[answeredQuestions.length - 1]

	// L'ajout de la réponse permet de traiter les questions dont la réponse est
	// "une possibilité", exemple "salarié . contrat . CDD"
	const lastStepWithAnswer =
		lastStep && situation[lastStep]
			? ([lastStep, situation[lastStep]]
					.join(' . ')
					.replace(/'/g, '')
					.trim() as DottedName)
			: lastStep

	const score = (question: string) => {
		const indexList =
			whitelist.findIndex((name) => question.startsWith(name)) + 1
		const indexNotPriority =
			notPriority.findIndex((name) => question.startsWith(name)) + 1
		const differenceCoeff = questionDifference(question, lastStepWithAnswer)

		return indexList + indexNotPriority + differenceCoeff
	}

	return nextSteps.sort((a, b) => score(a) - score(b))
}

export const useNextQuestions = function (): Array<DottedName> {
	const objectifs = useSelector(objectifsSelector)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const questionsConfig = useSelector(configSelector).questions
	const situation = useSelector(situationSelector)
	const engine = useContext(EngineContext)
	const missingVariables = objectifs.map(
		(objectif) => engine.evaluate(objectif).missingVariables ?? {}
	)
	const nextQuestions = useMemo(() => {
		let next = getNextQuestions(
			missingVariables,
			questionsConfig ?? {},
			answeredQuestions,
			situation
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
		situation,
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
