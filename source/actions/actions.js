/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction,
	StartConversationAction
} from 'Types/ActionsTypes'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import { normalizeBasePath } from '../utils'

import type { RouterHistory } from 'react-router-dom'

export function resetSimulation(): ResetSimulationAction {
	return {
		type: 'RESET_SIMULATION'
	}
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

export function loadPreviousSimulation(): LoadPreviousSimulationAction {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION'
	}
}

export function hideControl(id: string) {
	return { type: 'HIDE_CONTROL', id }
}

export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'
