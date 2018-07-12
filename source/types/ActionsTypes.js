/* @flow */

export type LoadPreviousSimulationAction = {
	type: 'LOAD_PREVIOUS_SIMULATION'
}

export type ResetSimulationAction = {
	type: 'RESET_SIMULATION'
}

export type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}

export type Action =
	| LoadPreviousSimulationAction
	| ResetSimulationAction
	| DeletePreviousSimulationAction
