import { describe, expect, it } from 'vitest'

import { previousQuestion } from '../actions/actions'
import { Simulation, simulation as simulationReducer } from './rootReducer'

const action = previousQuestion()
describe('simulationReducer', () => {
	describe('PREVIOUS_QUESTION', () => {
		it('works when currentQuestion is the last one answered', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b'],
			}
			expect(simulationReducer(state as Simulation, action)).toEqual({
				currentQuestion: 'a',
				answeredQuestions: ['a', 'b'],
			})
		})
		it('works when currentQuestion is not answered', () => {
			const state = {
				currentQuestion: 'c',
				answeredQuestions: ['a', 'b'],
			}
			expect(simulationReducer(state as Simulation, action)).toEqual({
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b'],
			})
		})

		it('works when in the middle of the history', () => {
			const state = {
				currentQuestion: 'b',
				answeredQuestions: ['a', 'b', 'c'],
			}
			expect(simulationReducer(state as unknown as Simulation, action)).toEqual(
				{
					currentQuestion: 'a',
					answeredQuestions: ['a', 'b', 'c'],
				}
			)
		})

		it('works when all question have been answered', () => {
			const state = {
				currentQuestion: null,
				answeredQuestions: ['a', 'b', 'c'],
			}
			expect(simulationReducer(state as unknown as Simulation, action)).toEqual(
				{
					currentQuestion: 'c',
					answeredQuestions: ['a', 'b', 'c'],
				}
			)
		})

		it('does nothing when on the first question', () => {
			const state = {
				currentQuestion: 'a',
				answeredQuestions: [],
			}
			expect(simulationReducer(state as unknown as Simulation, action)).toEqual(
				state
			)
		})

		it('does nothing when we went back to the first question', () => {
			const state = {
				currentQuestion: 'a',
				answeredQuestions: ['a', 'b'],
			}
			expect(simulationReducer(state as unknown as Simulation, action)).toEqual(
				state
			)
		})
	})
})
