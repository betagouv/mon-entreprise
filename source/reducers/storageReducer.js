/* @flow */

import type { State } from 'Types/State'
import type { Action } from 'Types/ActionsTypes'
import { createStateFromSavedSimulation } from 'Selectors/storageSelectors'

export default (state: State, action: Action): State => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION':
			return {
				...state,
				...createStateFromSavedSimulation(state)
			}
		case 'DELETE_PREVIOUS_SIMULATION':
			return {
				...state,
				previousSimulation: null
			}
		default:
			return state
	}
}
