import * as A from 'effect/Array'
import * as R from 'effect/Record'
import * as Optics from 'optics-ts'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { updateSituation } from '@/domaine/updateSituation'
import { updateSituationMultiple } from '@/domaine/updateSituationMultiple'
import { Action } from '@/store/actions/actions'
import { omit, reject } from '@/utils'

export type QuestionRépondue = {
	règle: DottedName
	applicable: boolean
}

export type Simulation = {
	key: string
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: SituationPublicodes
	targetUnit: string
	questionsRépondues: Array<QuestionRépondue>
	questionsSuivantes?: Array<DottedName>
}

export function simulationReducer(
	state: Simulation | null = null,
	action: Action
): Simulation | null {
	if (action.type === 'CONFIGURE_LA_SIMULATION') {
		const { config, url, key } = action

		return {
			key,
			config,
			url,
			hiddenNotifications: [],
			situation: {},
			targetUnit: config['unité par défaut'] || '€/mois',
			questionsRépondues: [],
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

		case 'RÉINITIALISE_LA_SIMULATION':
			return {
				...state,
				hiddenNotifications: [],
				situation: {},
				questionsRépondues: [],
			}

		case 'AJUSTE_LA_SITUATION': {
			return {
				...state,
				situation: R.reduce(
					action.amendement,
					state.situation,
					(newSituation, value, dottedName) => {
						if (value === undefined) {
							return omit(newSituation, dottedName)
						}

						return updateSituation(
							state.config,
							newSituation,
							dottedName,
							value
						)
					}
				),
			}
		}

		case 'ENREGISTRE_LA_RÉPONSE_À_LA_QUESTION': {
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

		case 'ENREGISTRE_LES_RÉPONSES_À_LA_QUESTION': {
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
					state.situation,
					action.règle,
					action.valeurs
				),
			}
		}

		case 'SUPPRIME_LA_RÈGLE_DE_LA_SITUATION': {
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

		case 'IGNORE_LA_QUESTION': {
			const questionsRépondues = [
				...state.questionsRépondues,
				{ règle: action.question, applicable: true },
			]

			const questionsSuivantes = state.questionsSuivantes?.filter(
				(question) => question !== action.question
			)

			return {
				...state,
				questionsRépondues,
				questionsSuivantes,
			}
		}

		case 'MET_À_JOUR_LES_QUESTIONS_SUIVANTES': {
			return {
				...state,
				questionsSuivantes: action.questionsSuivantes,
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
