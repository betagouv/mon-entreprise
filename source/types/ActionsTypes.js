/* @flow */

export type LoadPreviousSimulationAction = {
	type: 'LOAD_PREVIOUS_SIMULATION'
}

export type ResetSimulationAction = {
	type: 'RESET_SIMULATION'
}
export type StartConversationAction = {
	type: 'START_CONVERSATION',
	question?: string
}
export type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}
export type StepAction = {
	type: 'STEP_ACTION',
	name: 'fold' | 'unfold',
	step: string
}

export type Action =
	| StartConversationAction
	| LoadPreviousSimulationAction
	| ResetSimulationAction
	| DeletePreviousSimulationAction
	| StepAction
