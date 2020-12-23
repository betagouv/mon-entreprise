import { Simulation } from 'Reducers/rootReducer'
import { RootState } from './rootReducer'
import { retrievePersistedSimulation } from '../storage/persistSimulation'
import { EveryAction} from 'actions'

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

export default (state: RootState, action: EveryAction): RootState => {
	switch (action.type) {
		case 'SET_SIMULATION':
			return {
				...state,
				previousSimulation: retrievePersistedSimulation(action.url),
			}
		case 'LOAD_PREVIOUS_SIMULATION':
			return {
				...state,
				...createStateFromPreviousSimulation(state),
			}
		case 'DELETE_PREVIOUS_SIMULATION':
			return {
				...state,
				previousSimulation: null,
			}
		default:
			return state
	}
}
