/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	DeletePreviousSimulationAction
} from './types/Actions'

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
