/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction,
	StartConversationAction,
	SetSituationConfigAction,
	SetSituationBranchAction
} from 'Types/ActionsTypes'
import { reset } from 'redux-form'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import { normalizeBasePath } from '../utils'

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

export const setSimulationConfig = (
	config: Object
): SetSituationConfigAction => ({
	type: 'SET_SIMULATION_CONFIG',
	config
})

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
	_: any,
	history: RouterHistory
) => {
	dispatch({
		type: 'START_CONVERSATION',
		...(priorityNamespace ? { priorityNamespace } : {})
	})
	const currentPath = normalizeBasePath(history.location.pathname)
	if (currentPath.endsWith('/simulation/')) {
		return
	}

	history.push(currentPath + 'simulation')
}

// $FlowFixMe
export function setExample(name, situation, dottedName) {
	return { type: 'SET_EXAMPLE', name, situation, dottedName }
}

export const goBackToSimulation = () => (
	dispatch: any => void,
	_: any,
	history: RouterHistory
): void => {
	while (history.location.pathname.includes('documentation')) {
		history.goBack()
	}
	dispatch({ type: 'SET_EXAMPLE', name: null })
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
