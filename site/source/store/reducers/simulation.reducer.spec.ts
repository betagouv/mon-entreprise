import { describe, expect, it } from 'vitest'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { simulationReducer } from '@/store/reducers/simulation.reducer'

import {
	ajusteLaSituation,
	applicabilitéDesQuestionsRépondues,
	configureLaSimulation,
	enregistreLaRéponseÀLaQuestion,
	enregistreLesRéponsesÀLaQuestion,
	hideNotification,
	metÀJourLesQuestionsSuivantes,
	réinitialiseLaSimulation,
	retourneÀLaQuestionPrécédente,
	supprimeLaRègleDeLaSituation,
	updateUnit,
	vaÀLaQuestion,
	vaÀLaQuestionSuivante,
} from '../actions/actions'

const previousQuestionAction = retourneÀLaQuestionPrécédente()
const nextQuestionAction = vaÀLaQuestionSuivante()
const defaultState = {
	id: 'simulateur',
	config: {
		'objectifs exclusifs': [],
	},
	url: '/mon-simulateur',
	hiddenNotifications: [],
	situation: {},
	targetUnit: '€/mois',
	questionsRépondues: [],
}

describe('simulationReducer', () => {
	describe('CONFIGURE_LA_SIMULATION', () => {
		it('initialise la simulation avec la configuration et l’url fournies', () => {
			const state = null
			expect(
				simulationReducer(
					state,
					configureLaSimulation(
						{
							'objectifs exclusifs': [],
							'unité par défaut': '€/an',
						},
						'/mon-simulateur',
						'simulateur'
					)
				)
			).toMatchObject({
				config: {
					'objectifs exclusifs': [],
					'unité par défaut': '€/an',
				},
				url: '/mon-simulateur',
				hiddenNotifications: [],
				situation: {},
				targetUnit: '€/an',
				questionsRépondues: [],
				currentQuestion: null,
			})
		})
	})
	describe('RÉINITIALISE_LA_SIMULATION', () => {
		it('efface tout sauf la configuration de la simulation et l’unité sélectionnée', () => {
			const state = {
				id: 'simulateur',
				config: {
					'objectifs exclusifs': [],
					'unité par défaut': '€/an',
				},
				url: '/mon-simulateur',
				hiddenNotifications: ['notification'],
				situation: {
					['a' as DottedName]: 42,
				},
				targetUnit: '€/mois',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
				currentQuestion: 'b' as DottedName,
			}
			expect(
				simulationReducer(state, réinitialiseLaSimulation())
			).toMatchObject({
				config: {
					'objectifs exclusifs': [],
					'unité par défaut': '€/an',
				},
				url: '/mon-simulateur',
				hiddenNotifications: [],
				situation: {},
				targetUnit: '€/mois',
				questionsRépondues: [],
				currentQuestion: null,
			})
		})
	})
	describe('AJUSTE_LA_SITUATION', () => {
		it('ne marque pas les questions répondues', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					ajusteLaSituation({
						['c' as DottedName]: 42,
						['d' as DottedName]: 'oui',
					} as Record<DottedName, ValeurPublicodes>)
				)
			).toMatchObject({
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			})
		})
		it('enregistre les réponses dans la situation', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}

			expect(
				simulationReducer(
					state,
					ajusteLaSituation({
						['c' as DottedName]: 42,
						['d' as DottedName]: 'oui',
					} as Record<DottedName, ValeurPublicodes>)
				)
			).toMatchObject({
				situation: {
					c: 42,
					d: 'oui',
				},
			})
		})
	})
	describe('ENREGISTRE_LA_RÉPONSE_À_LA_QUESTION', () => {
		it('marque la question répondue si une réponse est fournie', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					enregistreLaRéponseÀLaQuestion('c' as DottedName, 42)
				)
			).toMatchObject({
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
			})
		})
		it('enregistre la réponse dans la situation', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}

			expect(
				simulationReducer(
					state,
					enregistreLaRéponseÀLaQuestion('c' as DottedName, 42)
				)
			).toMatchObject({
				situation: {
					c: 42,
				},
			})
		})
	})
	describe('ENREGISTRE_LES_RÉPONSES_À_LA_QUESTION', () => {
		it('marque la question répondue si des réponses sont fournies', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					enregistreLesRéponsesÀLaQuestion('c' as DottedName, {
						sub1: 42,
						'sub2 . subC': 'hello',
					})
				)
			).toMatchObject({
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
			})
		})
		it('enregistre les réponses dans la situation', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}

			expect(
				simulationReducer(
					state,
					enregistreLesRéponsesÀLaQuestion('c' as DottedName, {
						sub1: 42,
						'sub2 . subC': 'hello',
					})
				)
			).toMatchObject({
				situation: {
					'c . sub1': 42,
					'c . sub2 . subC': `'hello'`,
				},
			})
		})
	})
	describe('SUPPRIME_LA_RÈGLE_DE_LA_SITUATION', () => {
		it('supprime la question des questions répondues si réponse effacée', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
				situation: {
					['c' as DottedName]: 42,
				},
			}
			expect(
				simulationReducer(
					state,
					supprimeLaRègleDeLaSituation('c' as DottedName)
				)
			).toMatchObject({
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			})
		})
		it('ne change rien sinon', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
				situation: {
					['c' as DottedName]: 42,
				},
			}
			expect(
				simulationReducer(
					state,
					supprimeLaRègleDeLaSituation('d' as DottedName)
				)
			).toMatchObject({
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
			})
		})
	})
	describe('RETOURNE_À_LA_QUESTION_PRÉCÉDENTE', () => {
		it('fonctionne quand la question en cours est la dernière posée', () => {
			const state = {
				...defaultState,
				currentQuestion: 'c' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: false },
					{ règle: 'c' as DottedName, applicable: true },
				],
			}
			expect(simulationReducer(state, previousQuestionAction)).toMatchObject({
				currentQuestion: 'a',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: false },
					{ règle: 'c' as DottedName, applicable: true },
				],
			})
		})
		it('fonctionne quand la question en cours n’a pas été répondue', () => {
			const state = {
				...defaultState,
				currentQuestion: 'd' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
				],
			}
			expect(simulationReducer(state, previousQuestionAction)).toMatchObject({
				currentQuestion: 'b',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
				],
			})
		})

		it('fonctionne quand on est au milieu de l’historique', () => {
			const state = {
				...defaultState,
				currentQuestion: 'c' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: false },
					{ règle: 'c' as DottedName, applicable: true },
					{ règle: 'd' as DottedName, applicable: true },
				],
			}
			expect(simulationReducer(state, previousQuestionAction)).toMatchObject({
				currentQuestion: 'a',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: false },
					{ règle: 'c' as DottedName, applicable: true },
					{ règle: 'd' as DottedName, applicable: true },
				],
			})
		})

		it('fonctionne quand on a déjà répondu à toutes les questions', () => {
			const state = {
				...defaultState,
				currentQuestion: null,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
				],
			}
			expect(simulationReducer(state, previousQuestionAction)).toMatchObject({
				currentQuestion: 'b',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
				],
			})
		})

		it('ne fait rien si on est sur la première question', () => {
			const state = {
				...defaultState,
				currentQuestion: 'a' as DottedName,
				questionsRépondues: [],
			}
			expect(simulationReducer(state, previousQuestionAction)).toEqual(state)
		})

		it('ne fait rien quand on est revenu à la première question', () => {
			const state = {
				...defaultState,
				currentQuestion: 'a' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(simulationReducer(state, previousQuestionAction)).toEqual(state)
		})
	})
	describe('VA_À_LA_QUESTION_SUIVANTE', () => {
		it('va à la prochaine question déjà répondue de l’historique le cas échéant', () => {
			const state = {
				...defaultState,
				currentQuestion: 'b' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
					{ règle: 'd' as DottedName, applicable: true },
				],
			}
			expect(simulationReducer(state, nextQuestionAction)).toMatchObject({
				currentQuestion: 'd',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
					{ règle: 'd' as DottedName, applicable: true },
				],
			})
		})
		it('demande une nouvelle question si par défaut', () => {
			const state = {
				...defaultState,
				currentQuestion: 'b' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(simulationReducer(state, nextQuestionAction)).toMatchObject({
				currentQuestion: null,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			})
		})
		it('passe à la question suivante si la question actuelle n’a pas été répondue', () => {
			const state = {
				...defaultState,
				currentQuestion: 'c' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(simulationReducer(state, nextQuestionAction)).toMatchObject({
				currentQuestion: null,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
			})
		})
	})
	describe('VA_À_LA_QUESTION', () => {
		it('va à la question demandée', () => {
			const state = {
				...defaultState,
				currentQuestion: 'b' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state, vaÀLaQuestion('c' as DottedName))
			).toMatchObject({
				currentQuestion: 'c',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			})
		})
	})
	describe('MET_À_JOUR_LES_QUESTIONS_SUIVANTES', () => {
		it('enregistre la liste des questions suivantes fournies', () => {
			const state = {
				...defaultState,
				questionsSuivantes: ['a' as DottedName, 'b' as DottedName],
			}
			expect(
				simulationReducer(
					state,
					metÀJourLesQuestionsSuivantes(['c' as DottedName, 'd' as DottedName])
				)
			).toMatchObject({
				questionsSuivantes: ['c' as DottedName, 'd' as DottedName],
			})
		})
		it('prend la première des questions suivantes s’il n’y a pas de question en cours', () => {
			const state = {
				...defaultState,
				currentQuestion: null,
			}
			expect(
				simulationReducer(
					state,
					metÀJourLesQuestionsSuivantes(['a' as DottedName, 'b' as DottedName])
				)
			).toMatchObject({
				currentQuestion: 'a',
			})
		})
		it('prend la première des questions suivantes si la question en cours n’est pas à répondre ni répondue', () => {
			const state = {
				...defaultState,
				currentQuestion: 'c' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					metÀJourLesQuestionsSuivantes(['d' as DottedName, 'e' as DottedName])
				)
			).toMatchObject({
				currentQuestion: 'd',
			})
		})
		it('conserve la question en cours si elle n’est plus à répondre mais qu’elle est déjà répondue', () => {
			const state = {
				...defaultState,
				currentQuestion: 'b' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					metÀJourLesQuestionsSuivantes(['c' as DottedName, 'd' as DottedName])
				)
			).toMatchObject({
				currentQuestion: 'b',
			})
		})
		it('conserve la question en cours si elle est toujours à répondre et n’est pas encore répondue', () => {
			const state = {
				...defaultState,
				currentQuestion: 'c' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					metÀJourLesQuestionsSuivantes(['c' as DottedName, 'd' as DottedName])
				)
			).toMatchObject({
				currentQuestion: 'c',
			})
		})
		it('supprime la question en cours s’il n’y en a pas et qu’il n’y a pas de questions suivantes', () => {
			const state = {
				...defaultState,
				currentQuestion: null,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state, metÀJourLesQuestionsSuivantes([]))
			).toMatchObject({
				currentQuestion: null,
			})
		})
		it('supprime la question en cours si elle n’est plus nécessaire et qu’il n’y a pas de questions suivantes', () => {
			const state = {
				...defaultState,
				currentQuestion: 'c' as DottedName,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state, metÀJourLesQuestionsSuivantes([]))
			).toMatchObject({
				currentQuestion: null,
			})
		})
	})
	describe('APPLICABILITÉ_DES_QUESTIONS_RÉPONDUES', () => {
		it('fusionne la liste existante avec celle donnée', () => {
			const state = {
				...defaultState,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: false },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state,
					applicabilitéDesQuestionsRépondues([
						{ règle: 'a' as DottedName, applicable: true },
						{ règle: 'b' as DottedName, applicable: false },
					])
				)
			).toMatchObject({
				questionsRépondues: [
					{ règle: 'a', applicable: true },
					{ règle: 'b', applicable: false },
					{ règle: 'c', applicable: true },
				],
			})
		})
	})
	describe('UPDATE_TARGET_UNIT', () => {
		it('enregistre l’unité fournie', () => {
			const state = {
				...defaultState,
				targetUnit: '€/mois',
			}
			expect(simulationReducer(state, updateUnit('€/an'))).toMatchObject({
				targetUnit: '€/an',
			})
		})
	})
	describe('HIDE_NOTIFICATION', () => {
		it('enregistre la notification fournie dans les notifications masquées', () => {
			const state = {
				...defaultState,
				hiddenNotifications: [],
			}
			expect(
				simulationReducer(state, hideNotification('notification'))
			).toMatchObject({
				hiddenNotifications: ['notification'],
			})
		})
	})
})
