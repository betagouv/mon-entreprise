import { SitePaths } from 'Components/utils/withSitePaths'
import { History } from 'history'
import { RootState } from 'Reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { DottedName } from 'Types/rule'
import { deletePersistedSimulation } from '../storage/persistSimulation'

export type Action =
	| ResetSimulationAction
	| StepAction
	| UpdateAction
	| SetSimulationConfigAction
	| DeletePreviousSimulationAction
	| SetExempleAction
	| ExplainVariableAction
	| UpdatePeriodAction
	| HideControlAction
	| LoadPreviousSimulationAction
	| SetSituationBranchAction
	| SetActiveTargetAction

type ThunkResult<R> = ThunkAction<
	R,
	RootState,
	{ history: History; sitePaths: SitePaths },
	Action
>

type StepAction = {
	type: 'STEP_ACTION'
	name: 'fold' | 'unfold'
	step: string
}

type SetSimulationConfigAction = {
	type: 'SET_SIMULATION'
	url: string
	config: Object
}

type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}

type SetExempleAction = {
	type: 'SET_EXAMPLE'
	name: null | string
	situation?: object
	dottedName?: string
}

type ResetSimulationAction = ReturnType<typeof resetSimulation>
type UpdateAction = ReturnType<typeof updateSituation>
type UpdatePeriodAction = ReturnType<typeof updatePeriod>
type LoadPreviousSimulationAction = ReturnType<typeof loadPreviousSimulation>
type SetSituationBranchAction = ReturnType<typeof setSituationBranch>
type SetActiveTargetAction = ReturnType<typeof setActiveTarget>
type HideControlAction = ReturnType<typeof hideControl>
type ExplainVariableAction = ReturnType<typeof explainVariable>

export const resetSimulation = () =>
	({
		type: 'RESET_SIMULATION'
	} as const)

export const goToQuestion = (question: string) =>
	({
		type: 'STEP_ACTION',
		name: 'unfold',
		step: question
	} as const)

export const validateStepWithValue = (
	dottedName: DottedName,
	value: any
): ThunkResult<void> => dispatch => {
	dispatch(updateSituation(dottedName, value))
	dispatch({
		type: 'STEP_ACTION',
		name: 'fold',
		step: dottedName
	})
}

export const setSituationBranch = (id: number) =>
	({
		type: 'SET_SITUATION_BRANCH',
		id
	} as const)

export const setSimulationConfig = (config: Object): ThunkResult<void> => (
	dispatch,
	_,
	{ history }
): void => {
	const url = history.location.pathname
	dispatch({
		type: 'SET_SIMULATION',
		url,
		config
	})
}

export const setActiveTarget = (targetName: string) =>
	({
		type: 'SET_ACTIVE_TARGET_INPUT',
		name: targetName
	} as const)

export const deletePreviousSimulation = (): ThunkResult<void> => dispatch => {
	dispatch({
		type: 'DELETE_PREVIOUS_SIMULATION'
	})
	deletePersistedSimulation()
}

export const updateSituation = (fieldName: DottedName, value: any) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value
	} as const)

export const updatePeriod = (toPeriod: string) =>
	({
		type: 'UPDATE_PERIOD',
		toPeriod
	} as const)

export function setExample(name: string, situation, dottedName: string) {
	return { type: 'SET_EXAMPLE', name, situation, dottedName } as const
}

export const goBackToSimulation = (): ThunkResult<void> => (
	dispatch,
	getState,
	{ history }
) => {
	dispatch({ type: 'SET_EXAMPLE', name: null })
	history.push(getState().simulation.url)
}

export function loadPreviousSimulation() {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION'
	} as const
}

export function hideControl(id: string) {
	return { type: 'HIDE_CONTROL', id } as const
}

export const explainVariable = (variableName = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName
	} as const)
