import { DottedName } from 'modele-social'
import { describe, expect, it } from 'vitest'

import {
	Simulation,
	simulationReducer,
} from '@/store/reducers/simulation.reducer'

import {
	deleteFromSituation,
	enregistreLaRéponse,
	retourneÀLaQuestionPrécédente,
	vaÀLaQuestion,
	vaÀLaQuestionSuivante,
} from '../actions/actions'

const previousQuestionAction = retourneÀLaQuestionPrécédente()
const nextQuestionAction = vaÀLaQuestionSuivante()

describe('simulationReducer', () => {
	describe('RETOURNE_À_LA_QUESTION_PRÉCÉDENTE', () => {
		it('fonctionne quand la question en cours est la dernière posée', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b'],
			}
			expect(
				simulationReducer(state as Simulation, previousQuestionAction)
			).toEqual({
				currentQuestion: 'a',
				answeredQuestions: ['a', 'b'],
			})
		})
		it('fonctionne quand la question en cours n’a pas été répondue', () => {
			const state = {
				currentQuestion: 'c',
				answeredQuestions: ['a', 'b'],
			}
			expect(
				simulationReducer(state as Simulation, previousQuestionAction)
			).toEqual({
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b'],
			})
		})

		it('fonctionne quand on est au milieu de l’historique', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b', 'c'],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					previousQuestionAction
				)
			).toEqual({
				currentQuestion: 'a',
				answeredQuestions: ['a', 'b', 'c'],
			})
		})

		it('fonctionne quand on a déjà répondu à toutes les questions', () => {
			const state = {
				currentQuestion: null,
				answeredQuestions: ['a', 'b', 'c'],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					previousQuestionAction
				)
			).toEqual({
				currentQuestion: 'c',
				answeredQuestions: ['a', 'b', 'c'],
			})
		})

		it('ne fait rien si on est sur la première question', () => {
			const state = {
				currentQuestion: 'a',
				answeredQuestions: [],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					previousQuestionAction
				)
			).toEqual(state)
		})

		it('ne fait rien quand on est revenu à la première question', () => {
			const state = {
				currentQuestion: 'a',
				answeredQuestions: ['a', 'b'],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					previousQuestionAction
				)
			).toEqual(state)
		})
	})
	describe('VA_À_LA_QUESTION_SUIVANTE', () => {
		it('va à la prochaine question déjà répondue de l’historique le cas échéant', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b', 'c'],
			}
			expect(
				simulationReducer(state as unknown as Simulation, nextQuestionAction)
			).toEqual({
				currentQuestion: 'c',
				answeredQuestions: ['a', 'b', 'c'],
			})
		})
		it('demande une nouvelle question si par défaut', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b'],
			}
			expect(
				simulationReducer(state as unknown as Simulation, nextQuestionAction)
			).toEqual({
				currentQuestion: null,
				answeredQuestions: ['a', 'b'],
			})
		})
		it('passe à la question suivante si la question actuelle n’a pas été répondue', () => {
			const state = {
				currentQuestion: 'c',
				answeredQuestions: ['a', 'b'],
			}
			expect(
				simulationReducer(state as unknown as Simulation, nextQuestionAction)
			).toEqual({
				currentQuestion: null,
				answeredQuestions: ['a', 'b', 'c'],
			})
		})
	})
	describe('VA_À_LA_QUESTION', () => {
		it('va à la question demandée', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b'],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					vaÀLaQuestion('c' as DottedName)
				)
			).toEqual({
				currentQuestion: 'c',
				answeredQuestions: ['a', 'b'],
			})
		})
	})
	describe('ENREGISTRE_LA_RÉPONSE', () => {
		it('marque la question répondue si une réponse est fournie', () => {
			const state = {
				answeredQuestions: ['a', 'b'],
				config: {
					'objectifs exclusifs': [],
				},
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					enregistreLaRéponse('c' as DottedName, 42)
				)
			).toMatchObject({
				answeredQuestions: ['a', 'b', 'c'],
			})
		})
	})
	describe('DELETE_FROM_SITUATION', () => {
		it('supprime la question des questions répondues si réponse effacée', () => {
			const state = {
				answeredQuestions: ['a', 'b', 'c'],
				config: {
					'objectifs exclusifs': [],
				},
				situation: {
					c: 42,
				},
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					deleteFromSituation('c' as DottedName)
				)
			).toMatchObject({
				answeredQuestions: ['a', 'b'],
			})
		})
		it('ne change rien sinon', () => {
			const state = {
				answeredQuestions: ['a', 'b', 'c'],
				config: {
					'objectifs exclusifs': [],
				},
				situation: {
					c: 42,
				},
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					deleteFromSituation('d' as DottedName)
				)
			).toMatchObject({
				answeredQuestions: ['a', 'b', 'c'],
			})
		})
	})
})
