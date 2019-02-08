import type { SitePaths } from 'Components/utils/withSitePaths'
import type { RouterHistory } from 'react-router'

/* @flow */

export type LoadPreviousSimulationAction = {
	type: 'LOAD_PREVIOUS_SIMULATION'
}

export type ResetSimulationAction = {
	type: 'RESET_SIMULATION'
}
export type SetSimulationConfigAction = {
	type: 'SET_SIMULATION',
	config: Object
}
export type StartConversationAction = {
	type: 'START_CONVERSATION',
	priorityNamespace?: string
}
export type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}
export type SetSituationBranchAction = {
	type: 'SET_SITUATION_BRANCH',
	id: number
}
export type StepAction = {
	type: 'STEP_ACTION',
	name: 'fold' | 'unfold',
	step: string
}

export type Action =
	| StartConversationAction
	| SetSituationBranchAction
	| LoadPreviousSimulationAction
	| ResetSimulationAction
	| DeletePreviousSimulationAction
	| StepAction

export type Thunk<Action: Object> = (
	dispatch: (Action) => void,
	getState: () => any,
	{ history: RouterHistory, sitePaths: SitePaths }
) => void
