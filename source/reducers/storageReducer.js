/* @flow */

import type { State } from 'Types/State'
import type { Action } from 'Types/ActionsTypes'
import {
	createStateFromSavedSimulation,
	currentSimulationSelector
} from 'Selectors/storageSelectors'

export default (state: State, action: Action): State => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION':
			return {
				...state,
				...createStateFromSavedSimulation(state.previousSimulation)
			}
		case 'DELETE_PREVIOUS_SIMULATION':
			return {
				...state,
				previousSimulation: null
			}
		case 'RESET_SIMULATION':
			return {
				...state,
				previousSimulation: currentSimulationSelector(state)
			}
		default:
			return state
	}
}
