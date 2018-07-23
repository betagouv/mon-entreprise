/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction,
	StartConversationAction
} from 'Types/ActionsTypes'

export function resetSimulation(): ResetSimulationAction {
	return {
		type: 'RESET_SIMULATION'
	}
}

export function deletePreviousSimulation(): DeletePreviousSimulationAction {
	return {
		type: 'DELETE_PREVIOUS_SIMULATION'
	}
}

export function startConversation(question: ?string): StartConversationAction {
	return {
		type: 'START_CONVERSATION',
		...(question ? { question } : {})
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
