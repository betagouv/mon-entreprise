import * as A from 'effect/Array'
import { DottedName } from 'modele-social'
import * as Optics from 'optics-ts'

import { SimulationConfig } from '@/domaine/SimulationConfig'
import { Situation } from '@/domaine/Situation'
import { updateSituation } from '@/domaine/updateSituation'
import { updateSituationMulti } from '@/domaine/updateSituationMulti'
import { updateSituationMultiple } from '@/domaine/updateSituationMultiple'
import { Action } from '@/store/actions/actions'
import { omit, reject } from '@/utils'

export type QuestionRépondue = {
	règle: DottedName
	applicable: boolean
}

export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	targetUnit: string
	questionsRépondues: Array<QuestionRépondue>
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
			questionsRépondues: [],
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
				questionsRépondues: [],
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
			const déjàDansLesQuestionsRépondues = state.questionsRépondues.some(
				(question) => question.règle === action.fieldName
			)

			const answeredQuestions = déjàDansLesQuestionsRépondues
				? state.questionsRépondues
				: [
						...state.questionsRépondues,
						{ règle: action.fieldName, applicable: true },
				  ]

			return {
				...state,
				questionsRépondues: answeredQuestions,
				situation: updateSituation(
					state.config,
					state.situation,
					action.fieldName,
					action.value
				),
			}
		}

		case 'ENREGISTRE_LES_RÉPONSES': {
			const déjàDansLesQuestionsRépondues = state.questionsRépondues.some(
				(question) => question.règle === action.règle
			)

			const answeredQuestions = déjàDansLesQuestionsRépondues
				? state.questionsRépondues
				: [
						...state.questionsRépondues,
						{ règle: action.règle, applicable: true },
				  ]

			return {
				...state,
				questionsRépondues: answeredQuestions,
				situation: updateSituationMultiple(
					state.config,
					state.situation,
					action.règle,
					action.valeurs
				),
			}
		}

		case 'DELETE_FROM_SITUATION': {
			const newState = {
				...state,
				questionsRépondues: reject(
					state.questionsRépondues,
					(q) => q.règle === action.fieldName
				),
				situation: omit(
					state.situation,
					action.fieldName
				) as Simulation['situation'],
			}

			return newState
		}
		case 'RETOURNE_À_LA_QUESTION_PRÉCÉDENTE': {
			if (state.questionsRépondues.length === 0) {
				return state
			}

			const currentIndex = state.currentQuestion
				? state.questionsRépondues.findIndex(
						(question) => question.règle === state.currentQuestion
				  )
				: -1

			if (currentIndex === -1) {
				return {
					...state,
					currentQuestion: state.questionsRépondues
						.filter((q) => q.applicable)
						.at(-1)?.règle,
				}
			}

			const destination = state.questionsRépondues.findLastIndex(
				(q, index) => index < currentIndex && q.applicable
			)

			if (destination === -1) {
				return state
			}

			return {
				...state,
				currentQuestion: state.questionsRépondues[destination]?.règle,
			}
		}

		case 'VA_À_LA_QUESTION_SUIVANTE': {
			const currentIndex = state.currentQuestion
				? state.questionsRépondues.findIndex(
						(question) => question.règle === state.currentQuestion
				  )
				: -1

			// La question en cours n'est pas répondue, l’usager veut passer la question
			if (currentIndex === -1 && state.currentQuestion) {
				const answeredQuestions = [
					...state.questionsRépondues,
					{ règle: state.currentQuestion, applicable: true },
				]

				const questionsSuivantes = state.questionsSuivantes?.filter(
					(question) => question !== state.currentQuestion
				)

				return {
					...state,
					questionsRépondues: answeredQuestions,
					currentQuestion: questionsSuivantes?.[0] || null,
					questionsSuivantes,
				}
			}

			// On était sur la dernière question posée, on en prend une nouvelle
			if (currentIndex === state.questionsRépondues.length - 1) {
				return {
					...state,
					currentQuestion: state.questionsSuivantes?.length
						? state.questionsSuivantes[0]
						: null,
				}
			}

			// Sinon, on navigue simplement à la questions déjà répondue suivante
			const destination = state.questionsRépondues.findIndex(
				(q, index) => index > currentIndex && q.applicable
			)
			if (destination > -1) {
				return {
					...state,
					currentQuestion: state.questionsRépondues[destination].règle,
				}
			}

			// On est sur la dernière question posée applicable, on en prend une nouvelle
			return {
				...state,
				currentQuestion: state.questionsSuivantes?.length
					? state.questionsSuivantes[0]
					: null,
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
				? !state.questionsRépondues?.some(
						(question) => question.règle === currentQuestion
				  )
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

		case 'APPLICABILITÉ_DES_QUESTIONS_RÉPONDUES': {
			const questionFocuser = Optics.optic<Array<QuestionRépondue>>().elems()

			return {
				...state,
				questionsRépondues: A.reduce(
					action.questionsRépondues,
					state.questionsRépondues,
					(acc: Array<QuestionRépondue>, questionÀJour: QuestionRépondue) => {
						const focus = questionFocuser.when(
							(question) => question.règle === questionÀJour.règle
						)

						return Optics.modify(focus)((q) => ({
							...q,
							applicable: questionÀJour.applicable,
						}))(acc)
					}
				),
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
