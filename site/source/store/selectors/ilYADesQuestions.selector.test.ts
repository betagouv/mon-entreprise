import { describe, expect, it } from 'vitest'

import { RootState } from '@/store/reducers/rootReducer'
import { ilYADesQuestionsSelector } from '@/store/selectors/ilYADesQuestions.selector'

describe('sélecteur ilYADesQuestions', () => {
	it('retourne true si une question est en cours', () => {
		expect(
			ilYADesQuestionsSelector({
				simulation: {
					currentQuestion: 'a',
					questionsSuivantes: [],
				},
			} as unknown as RootState)
		).toEqual(true)
	})
	it('retourne true si au moins une question en attente', () => {
		expect(
			ilYADesQuestionsSelector({
				simulation: {
					currentQuestion: undefined,
					questionsSuivantes: ['a'],
				},
			} as unknown as RootState)
		).toEqual(true)
	})
	it('retourne true si au moins une question répondue', () => {
		expect(
			ilYADesQuestionsSelector({
				simulation: {
					currentQuestion: undefined,
					questionsSuivantes: [],
					questionsRépondues: ['a'],
				},
			} as unknown as RootState)
		).toEqual(true)
	})
})
