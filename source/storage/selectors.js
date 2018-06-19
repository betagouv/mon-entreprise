/* @flow */
import type { Situation } from '../types/Situation.js'
import type { SavedSimulation, State } from '../types/State.js'

const situationSelector: State => Situation = state =>
	state.form.conversation.values

export const currentSimulationSelector: State => SavedSimulation = state => ({
	situation: situationSelector(state),
	activeTargetInput: state.activeTargetInput,
	foldedSteps: state.conversationSteps.foldedSteps
})

export const createStateFromSavedSimulation: (
	?SavedSimulation
) => ?$Supertype<State> = simulation =>
	simulation && {
		activeTargetInput: simulation.activeTargetInput,
		form: {
			conversation: {
				values: simulation.situation
			}
		},
		conversationSteps: {
			foldedSteps: simulation.foldedSteps 
		},
		conversationStarted: true,
		previousSimulation: null
	}
