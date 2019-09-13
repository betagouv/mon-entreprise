/* @flow */
import type { SavedSimulation, State } from 'Types/State.js'

export const currentSimulationSelector: State => SavedSimulation = state => {
	return {
		situation: state.simulation.situation,
		activeTargetInput: state.activeTargetInput,
		foldedSteps: state.conversationSteps.foldedSteps
	}
}

export const createStateFromSavedSimulation = state =>
	state.previousSimulation && {
		activeTargetInput: state.previousSimulation.activeTargetInput,
		simulation: {
			...state.simulation,
			situation: state.previousSimulation.situation || {}
		},
		conversationSteps: {
			foldedSteps: state.previousSimulation.foldedSteps
		},
		previousSimulation: null
	}
