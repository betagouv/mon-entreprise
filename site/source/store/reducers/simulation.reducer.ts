import { DottedName } from 'modele-social'

import { estObjectifExclusifDeLaSimulation } from '@/domaine/estObjectifExclusifDeLaSimulation'
import { estQuestionEnListeNoire } from '@/domaine/estQuestionEnListeNoire'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { Situation } from '@/domaine/Situation'
import { updateSituation } from '@/domaine/updateSituation'
import { updateSituationMulti } from '@/domaine/updateSituationMulti'
import { Action } from '@/store/actions/actions'
import { omit, reject } from '@/utils'

export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	targetUnit: string
	answeredQuestions: Array<DottedName>
	questionsSuivantes?: Array<DottedName>
	currentQuestion?: DottedName | null
}

export function simulationReducer(
	state: Simulation | null = null,
	action: Action
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const { config, url } = action

		return {
			config,
			url,
			hiddenNotifications: [],
			situation: {},
			targetUnit: config['unité par défaut'] || '€/mois',
			answeredQuestions: [],
			currentQuestion: null,
		}
	}

	if (state === null) {
		return state
	}

	switch (action.type) {
		case 'HIDE_NOTIFICATION':
			return {
				...state,
				hiddenNotifications: [...state.hiddenNotifications, action.id],
			}
		case 'RESET_SIMULATION':
			return {
				...state,
				hiddenNotifications: [],
				situation: {},
				answeredQuestions: [],
				currentQuestion: null,
			}

		case 'AJUSTE_LA_SITUATION': {
			return {
				...state,
				situation: updateSituationMulti(
					state.config,
					state.situation,
					action.amendement
				),
			}
		}

		case 'ENREGISTRE_LA_RÉPONSE': {
			const déjàDansLesQuestionsRépondues = state.answeredQuestions.includes(
				action.fieldName
			)

			const answeredQuestions =
				déjàDansLesQuestionsRépondues ||
				estQuestionEnListeNoire(state.config)(action.fieldName) ||
				estObjectifExclusifDeLaSimulation(state.config)(action.fieldName)
					? state.answeredQuestions
					: [...state.answeredQuestions, action.fieldName]

			return {
				...state,
				answeredQuestions,
				situation: updateSituation(
					state.config,
					state.situation,
					action.fieldName,
					action.value
				),
			}
		}

		case 'DELETE_FROM_SITUATION': {
			const newState = {
				...state,
				answeredQuestions: reject(
					state.answeredQuestions,
					(q) => q === action.fieldName
				),
				situation: omit(
					state.situation,
					action.fieldName
				) as Simulation['situation'],
			}

			return newState
		}
		case 'RETOURNE_À_LA_QUESTION_PRÉCÉDENTE': {
			if (state.answeredQuestions.length === 0) {
				return state
			}

			const currentIndex = state.currentQuestion
				? state.answeredQuestions.indexOf(state.currentQuestion)
				: -1

			if (currentIndex === -1) {
				return {
					...state,
					currentQuestion: state.answeredQuestions.at(-1),
				}
			}

			const previousQuestion = state.answeredQuestions[currentIndex - 1]
			if (previousQuestion === undefined) {
				return state
			}

			return {
				...state,
				currentQuestion: previousQuestion,
			}
		}

		case 'VA_À_LA_QUESTION_SUIVANTE': {
			const currentIndex = state.currentQuestion
				? state.answeredQuestions.indexOf(state.currentQuestion)
				: -1

			// La question en cours n'est pas répondue, l’usager veut passer la question
			if (currentIndex === -1 && state.currentQuestion) {
				const answeredQuestions = [
					...state.answeredQuestions,
					state.currentQuestion,
				]

				const questionsSuivantes = state.questionsSuivantes?.filter(
					(question) => question !== state.currentQuestion
				)

				return {
					...state,
					answeredQuestions,
					currentQuestion: questionsSuivantes?.[0] || null,
					questionsSuivantes,
				}
			}

			// On était sur la dernière question posée, on en prend une nouvelle
			if (currentIndex === state.answeredQuestions.length - 1) {
				const questionEnCours = state.questionsSuivantes?.length
					? state.questionsSuivantes[0]
					: null

				return {
					...state,
					currentQuestion: questionEnCours,
				}
			}

			// Sinon, on navigue simplement à la questions déjà répondue suivante
			return {
				...state,
				currentQuestion: state.answeredQuestions[currentIndex + 1],
			}
		}

		case 'VA_À_LA_QUESTION': {
			return {
				...state,
				currentQuestion: action.question,
			}
		}

		case 'QUESTIONS_SUIVANTES': {
			const currentQuestion = state.currentQuestion
			const pasDeQuestionEnCours = !currentQuestion
			const questionEnCoursNEstPasÀRépondre = currentQuestion
				? !action.questionsSuivantes.includes(currentQuestion)
				: false
			const questionEnCoursNEstPasRépondue = currentQuestion
				? !state.answeredQuestions?.includes(currentQuestion)
				: false
			const questionEnCoursPlusNécessaire =
				questionEnCoursNEstPasÀRépondre && questionEnCoursNEstPasRépondue

			const nouvelleQuestionEnCours =
				action.questionsSuivantes.length &&
				(pasDeQuestionEnCours || questionEnCoursPlusNécessaire)
					? action.questionsSuivantes[0]
					: currentQuestion

			return {
				...state,
				questionsSuivantes: action.questionsSuivantes,
				currentQuestion: nouvelleQuestionEnCours,
			}
		}

		case 'UPDATE_TARGET_UNIT':
			return {
				...state,
				targetUnit: action.targetUnit,
			}
	}

	return state
}
