import { RootState, Simulation } from 'Reducers/rootReducer'

// Note: it is currently not possible to define SavedSimulation as the return
// type of the currentSimulationSelector function because the type would then
// circulary reference itself.
export type SavedSimulation = {
	situation: Simulation['situation']
	activeTargetInput: RootState['activeTargetInput']
	foldedSteps: RootState['conversationSteps']['foldedSteps']
}

export const currentSimulationSelector = (
	state: RootState
): SavedSimulation => {
	return {
		situation: state.simulation?.situation ?? {},
		activeTargetInput: state.activeTargetInput,
		foldedSteps: state.conversationSteps.foldedSteps
	}
}

export const createStateFromSavedSimulation = (
	state: RootState
): Partial<RootState> =>
	state.previousSimulation
		? {
				activeTargetInput: state.previousSimulation.activeTargetInput,
				simulation: {
					...state.simulation,
					situation: state.previousSimulation.situation || {}
				} as Simulation,
				conversationSteps: {
					foldedSteps: state.previousSimulation.foldedSteps
				},
				previousSimulation: null
		  }
		: {}
