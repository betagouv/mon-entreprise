import { Dispatch, Middleware } from 'redux'

import { loadEngineFromModeleId } from '@/utils/publicodes/getEngine'

import { Action } from '../actions/actions'
import { RootState } from '../reducers/rootReducer'

export const chargeEngineSelonConfig: Middleware<
	object,
	RootState,
	Dispatch<Action>
> = () => (next) => async (action: Action) => {
		console.log('chargeEngineSelonConfig')
	if (action.type === 'SET_SIMULATION') {
		await loadEngineFromModeleId(action.config.modeleId)
	}

	return next(action)
}
