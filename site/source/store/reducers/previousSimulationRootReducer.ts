import { retrievePersistedSimulation } from '@/storage/persistSimulation'
import { Action } from '@/store/actions/actions'
import { Simulation } from '@/store/reducers/simulation.reducer'

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
					questionsRépondues: state.previousSimulation.questionsRépondues,
				} as Simulation,
				previousSimulation: null,
		  }
		: {}

export default (state: RootState, action: Action): RootState => {
	switch (action.type) {
		case 'CONFIGURE_LA_SIMULATION':
			return {
				...state,
				previousSimulation: retrievePersistedSimulation(action.url),
			}
		case 'CHARGE_LA_SIMULATION_PRÉCÉDENTE':
			return {
				...state,
				...createStateFromPreviousSimulation(state),
			}
		default:
			return state
	}
}
