import { SitePaths } from 'Components/utils/SitePathsContext'
import { History } from 'history'
import { RootState, SimulationConfig, Situation } from 'Reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { DottedName } from 'modele-social'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import { CompanyStatusAction } from './companyStatusActions'

export type Action =
	| ResetSimulationAction
	| StepAction
	| UpdateAction
	| SetSimulationConfigAction
	| ExplainVariableAction
	| UpdateSituationAction
	| HideNotificationAction
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

type SetSimulationConfigAction = ReturnType<typeof setSimulationConfig>
type ResetSimulationAction = ReturnType<typeof resetSimulation>
type UpdateAction = ReturnType<typeof updateSituation>
type UpdateSituationAction = ReturnType<typeof updateSituation>
type LoadPreviousSimulationAction = ReturnType<typeof loadPreviousSimulation>
type SetSituationBranchAction = ReturnType<typeof setSituationBranch>
type SetActiveTargetAction = ReturnType<typeof setActiveTarget>
type HideNotificationAction = ReturnType<typeof hideNotification>
type ExplainVariableAction = ReturnType<typeof explainVariable>
type UpdateTargetUnitAction = ReturnType<typeof updateUnit>

export const resetSimulation = () =>
	({
		type: 'RESET_SIMULATION',
	} as const)

export const goToQuestion = (question: DottedName) =>
	({
		type: 'STEP_ACTION',
		name: 'unfold',
		step: question,
	} as const)

export const setSituationBranch = (id: number) =>
	({
		type: 'SET_SITUATION_BRANCH',
		id,
	} as const)

export const setSimulationConfig = (
	config: SimulationConfig,
	url: string,
	initialSituation?: Situation
) =>
	({
		type: 'SET_SIMULATION',
		url,
		config,
		initialSituation,
	} as const)

export const setActiveTarget = (targetName: DottedName) =>
	({
		type: 'SET_ACTIVE_TARGET_INPUT',
		name: targetName,
	} as const)

export const updateSituation = (fieldName: DottedName, value: unknown) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value,
	} as const)

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit,
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
		type: 'LOAD_PREVIOUS_SIMULATION',
	} as const
}

export function hideNotification(id: string) {
	return { type: 'HIDE_NOTIFICATION', id } as const
}

export const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName,
	} as const)
