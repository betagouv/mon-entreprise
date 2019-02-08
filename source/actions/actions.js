/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction,
	StartConversationAction,
	SetSimulationConfigAction,
	SetSituationBranchAction
} from 'Types/ActionsTypes'
// $FlowFixMe
import { reset } from 'redux-form'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import type { Thunk } from 'Types/ActionsTypes'

export const resetSimulation = () => (dispatch: any => void): void => {
	dispatch(
		({
			type: 'RESET_SIMULATION'
		}: ResetSimulationAction)
	)
	dispatch(reset('conversation'))
}

export const setSituationBranch = (id: number): SetSituationBranchAction => ({
	type: 'SET_SITUATION_BRANCH',
	id
})

export const setSimulationConfig = (
	config: Object
): Thunk<SetSimulationConfigAction> => (dispatch, _, { history }): void => {
	const url = history.location.pathname
	dispatch({
		type: 'SET_SIMULATION',
		url,
		config
	})
}

export const deletePreviousSimulation = () => (
	dispatch: DeletePreviousSimulationAction => void
) => {
	dispatch({
		type: 'DELETE_PREVIOUS_SIMULATION'
	})
	deletePersistedSimulation()
}

export const startConversation = (priorityNamespace: ?string) => (
	dispatch: StartConversationAction => void
) => {
	dispatch({
		type: 'START_CONVERSATION',
		...(priorityNamespace ? { priorityNamespace } : {})
	})
}

// $FlowFixMe
export function setExample(name, situation, dottedName) {
	return { type: 'SET_EXAMPLE', name, situation, dottedName }
}

export const goBackToSimulation = (): Thunk<any> => (
	dispatch,
	getState,
	{ history }
) => {
	dispatch({ type: 'SET_EXEMPLE', name: null })
	history.push(getState().simulation.url)
}

export function loadPreviousSimulation(): LoadPreviousSimulationAction {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION'
	}
}

export function hideControl(id: string) {
	return { type: 'HIDE_CONTROL', id }
}

export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'
