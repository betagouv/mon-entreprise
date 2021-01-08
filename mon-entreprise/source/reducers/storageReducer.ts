import { Action } from 'Actions/actions'
import { createStateFromSavedSimulation } from 'Selectors/storageSelectors'
import { RootState } from './rootReducer'

export default (state: RootState, action: Action): RootState => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION':
			return {
				...state,
				...createStateFromSavedSimulation(state),
			}
		default:
			return state
	}
}
