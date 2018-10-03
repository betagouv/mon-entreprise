/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction,
	StartConversationAction
} from 'Types/ActionsTypes'
import { deletePersistedSimulation } from '../storage/persistSimulation'

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

export function startConversation(question: ?string): StartConversationAction {
	return {
		type: 'START_CONVERSATION',
		...(typeof question === 'string' ? { question } : {})
	}
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

export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'
