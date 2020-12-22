import { Simulation } from 'Reducers/rootReducer'
import { Action } from 'Actions/actions'
import { RootState } from './rootReducer'

export const createStateFromPreviousSimulation = (
	state: RootState
): Partial<RootState> =>
	state.previousSimulation
		? {
				activeTargetInput: state.previousSimulation.activeTargetInput,
				simulation: {
					...state.simulation,
					situation: state.previousSimulation.situation || {},
					foldedSteps: state.previousSimulation.foldedSteps,
				} as Simulation,
				previousSimulation: null,
		  }
		: {}

export default (state: RootState, action: Action): RootState => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION':
			return {
				...state,
				...createStateFromPreviousSimulation(state),
			}
		default:
			return state
	}
}
