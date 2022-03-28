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

type MissingVariables = Array<DottedName>

export function getNextSteps(
	missingVariables: Array<MissingVariables>
): Array<DottedName> {
	if (missingVariables.length === 0) {
		return []
	}

	// We want to merge the different lists of missing variables but don't want to
	// concatenate naively as it will ignore the “natural order determined by
	// publicodes. There isn't one unique solution to this problem but we choose
	// to first take all the 1st elements, then all the 2nd, 3rd, etc.
	// [a, b, c]
	// [c, d]       =>   [a, c, b, d]
	// [a]
	const maxLength = Math.max(...missingVariables.map((arr) => arr.length))
	const mergedMissings = new Set<DottedName>()
	for (let i = 0; i < maxLength; i++) {
		missingVariables.forEach((arr) => {
			if (arr.length > i) {
				mergedMissings.add(arr[i])
			}
		})
	}
	const mergedMissingsList = Array.from(mergedMissings)

	const score = (name: DottedName) => {
		// We want to boost top-level question, and questions that are required in
		// multiple goals.
		const namespaceDepthScore = Math.max(0, 4 - name.split('.').length) / 4
		const naturalPositionScore =
			(mergedMissingsList.length - mergedMissingsList.indexOf(name)) /
			mergedMissingsList.length
		const frequencyScore =
			missingVariables.filter((arr) => arr.includes(name)).length / maxLength

		// We can manually ajust the coefficients here
		return (
			3 * namespaceDepthScore + 3 * naturalPositionScore + 1 * frequencyScore
		)
	}

	return mergedMissingsList.sort((a, b) => score(b) - score(a))
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
		...Object.values(displayed),
		...getNextSteps(missingVariables),
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
	// "une possibilité", exemple "contrat salarié . cdd"
	const lastStepWithAnswer =
		lastStep && situation[lastStep]
			? ([lastStep, situation[lastStep]]
					.join(' . ')
					.replace(/'/g, '')
					.trim() as DottedName)
			: lastStep

	const score = (question: DottedName) => {
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
		(objectif) => engine.evaluate(objectif).missingVariables ?? []
	)
	const nextQuestions = useMemo(() => {
		let next = getNextQuestions(
			missingVariables as any,
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

export function useSimulationProgress(): number {
	const numberQuestionAnswered = useSelector(answeredQuestionsSelector).length
	const numberQuestionLeft = useNextQuestions().length

	return numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft)
}
