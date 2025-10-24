import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	Simulation,
	simulationReducer,
} from '@/store/reducers/simulation.reducer'

import {
	applicabilitéDesQuestionsRépondues,
	enregistreLaRéponseÀLaQuestion,
	enregistreLesRéponsesÀLaQuestion,
	retourneÀLaQuestionPrécédente,
	supprimeLaRègleDeLaSituation,
	vaÀLaQuestion,
	vaÀLaQuestionSuivante,
} from '../actions/actions'

const previousQuestionAction = retourneÀLaQuestionPrécédente()
const nextQuestionAction = vaÀLaQuestionSuivante()

describe('simulationReducer', () => {
	describe('RETOURNE_À_LA_QUESTION_PRÉCÉDENTE', () => {
		it('fonctionne quand la question en cours est la dernière posée', () => {
			const state = {
				currentQuestion: 'c',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: false },
					{ règle: 'c' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state as Simulation, previousQuestionAction)
			).toEqual({
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
				currentQuestion: 'd',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
				],
			}
			expect(
				simulationReducer(state as Simulation, previousQuestionAction)
			).toEqual({
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
				currentQuestion: 'c',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: false },
					{ règle: 'c' as DottedName, applicable: true },
					{ règle: 'd' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					previousQuestionAction
				)
			).toEqual({
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
				currentQuestion: null,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
				],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					previousQuestionAction
				)
			).toEqual({
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
				currentQuestion: 'a',
				questionsRépondues: [],
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
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
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
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: false },
					{ règle: 'd' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state as unknown as Simulation, nextQuestionAction)
			).toEqual({
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
				currentQuestion: 'b',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state as unknown as Simulation, nextQuestionAction)
			).toEqual({
				currentQuestion: null,
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			})
		})
		it('passe à la question suivante si la question actuelle n’a pas été répondue', () => {
			const state = {
				currentQuestion: 'c',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(state as unknown as Simulation, nextQuestionAction)
			).toEqual({
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
				currentQuestion: 'b',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
					vaÀLaQuestion('c' as DottedName)
				)
			).toEqual({
				currentQuestion: 'c',
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
			})
		})
	})
	describe('ENREGISTRE_LA_RÉPONSE_À_LA_QUESTION', () => {
		it('marque la question répondue si une réponse est fournie', () => {
			const state = {
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
				config: {
					'objectifs exclusifs': [],
				},
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
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
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
				config: {
					'objectifs exclusifs': [],
				},
			}

			expect(
				simulationReducer(
					state as unknown as Simulation,
					enregistreLaRéponseÀLaQuestion('c' as DottedName, 42)
				)
			).toMatchObject({
				situation: {
					c: 42,
				},
			})
		})
		it('enregistre correctement les réponses multiples', () => {
			const state = {
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
				],
				config: {
					'objectifs exclusifs': [],
				},
			}

			expect(
				simulationReducer(
					state as unknown as Simulation,
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
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
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
				questionsRépondues: [
					{ règle: 'a' as DottedName, applicable: true },
					{ règle: 'b' as DottedName, applicable: true },
					{ règle: 'c' as DottedName, applicable: true },
				],
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
	describe('APPLICABILITÉ_DES_QUESTIONS_RÉPONDUES', () => {
		it('fusionne la liste existante avec celle donnée', () => {
			const state = {
				questionsRépondues: [
					{ règle: 'a', applicable: false },
					{ règle: 'b', applicable: true },
					{ règle: 'c', applicable: true },
				],
			}
			expect(
				simulationReducer(
					state as unknown as Simulation,
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
})
