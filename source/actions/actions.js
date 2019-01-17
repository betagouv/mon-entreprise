/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction,
	StartConversationAction,
	SetSimulationConfigAction,
	SetSituationBranchAction
} from 'Types/ActionsTypes'
import { reset } from 'redux-form'
import { deletePersistedSimulation } from '../storage/persistSimulation'

import type { RouterHistory } from 'react-router-dom'

export const resetSimulation = () => (dispatch: any => void): void => {
	dispatch(reset('conversation'))
	dispatch(
		({
			type: 'RESET_SIMULATION'
		}: ResetSimulationAction)
	)
}

export const setSituationBranch = (id: number): SetSituationBranchAction => ({
	type: 'SET_SITUATION_BRANCH',
	id
})

export const setSimulationConfig = (config: Object) => (
	dispatch: SetSimulationConfigAction => void,
	_: any,
	history: RouterHistory
): void => {
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
	dispatch: StartConversationAction => void,
	_: any
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

export const goBackToSimulation = () => (
	dispatch: any => void,
	getState: any,
	history: RouterHistory
): void => {
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
