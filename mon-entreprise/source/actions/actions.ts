import { SitePaths } from 'Components/utils/SitePathsContext'
import { History } from 'history'
import { RootState, SimulationConfig } from 'Reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { DottedName } from 'Rules'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import { CompanyStatusAction } from './companyStatusActions'

export type Action =
	| ResetSimulationAction
	| StepAction
	| UpdateAction
	| SetSimulationConfigAction
	| DeletePreviousSimulationAction
	| ExplainVariableAction
	| UpdateSituationAction
	| HideControlAction
	| LoadPreviousSimulationAction
	| SetSituationBranchAction
	| UpdateTargetUnitAction
	| SetActiveTargetAction
	| CompanyStatusAction

export type ThunkResult<R = void> = ThunkAction<
	R,
	RootState,
	{ history: History; sitePaths: SitePaths },
	Action
>

type StepAction = {
	type: 'STEP_ACTION'
	name: 'fold' | 'unfold'
	step: DottedName
}

type SetSimulationConfigAction = {
	type: 'SET_SIMULATION'
	url: string
	config: SimulationConfig
	useCompanyDetails: boolean
}

type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}

type ResetSimulationAction = ReturnType<typeof resetSimulation>
type UpdateAction = ReturnType<typeof updateSituation>
type UpdateSituationAction = ReturnType<typeof updateSituation>
type LoadPreviousSimulationAction = ReturnType<typeof loadPreviousSimulation>
type SetSituationBranchAction = ReturnType<typeof setSituationBranch>
type SetActiveTargetAction = ReturnType<typeof setActiveTarget>
type HideControlAction = ReturnType<typeof hideControl>
type ExplainVariableAction = ReturnType<typeof explainVariable>
type UpdateTargetUnitAction = ReturnType<typeof updateUnit>

export const resetSimulation = () =>
	({
		type: 'RESET_SIMULATION'
	} as const)

export const goToQuestion = (question: DottedName) =>
	({
		type: 'STEP_ACTION',
		name: 'unfold',
		step: question
	} as const)

export const validateStepWithValue = (
	dottedName: DottedName,
	value: unknown
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

export const setSimulationConfig = (
	config: SimulationConfig,
	useCompanyDetails = false
): ThunkResult<void> => (dispatch, getState, { history }): void => {
	if (getState().simulation?.config === config) {
		return
	}
	const url = history.location.pathname
	dispatch({
		type: 'SET_SIMULATION',
		url,
		useCompanyDetails,
		config
	})
}

export const setActiveTarget = (targetName: DottedName) =>
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

export const updateSituation = (fieldName: DottedName, value: unknown) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value
	} as const)

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit
	} as const)

export const goBackToSimulation = (): ThunkResult<void> => (
	_,
	getState,
	{ history }
) => {
	const url = getState().simulation?.url
	url && history.push(url)
}

export function loadPreviousSimulation() {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION'
	} as const
}

export function hideControl(id: string) {
	return { type: 'HIDE_CONTROL', id } as const
}

export const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName
	} as const)
