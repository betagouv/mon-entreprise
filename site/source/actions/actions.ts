import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { SimulationConfig, Situation } from 'Reducers/rootReducer'
import { CompanyCreationAction } from './companyCreationChecklistActions'
import { CompanyStatusAction } from './companyStatusActions'
import { ActionExistingCompany } from './existingCompanyActions'
import { HiringChecklistAction } from './hiringChecklistAction'

export type Action =
	| ReturnType<
			| typeof explainVariable
			| typeof goToQuestion
			| typeof hideNotification
			| typeof loadPreviousSimulation
			| typeof resetSimulation
			| typeof setActiveTarget
			| typeof setSimulationConfig
			| typeof stepAction
			| typeof updateSituation
			| typeof updateSituation
			| typeof updateUnit
			| typeof batchUpdateSituation
	  >
	| CompanyCreationAction
	| CompanyStatusAction
	| ActionExistingCompany
	| HiringChecklistAction

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

export const stepAction = (step: DottedName, source?: string) =>
	({
		type: 'STEP_ACTION',
		name: 'fold',
		step,
		source,
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

export const batchUpdateSituation = (
	situation: Parameters<Engine<DottedName>['setSituation']>[0]
) =>
	({
		type: 'BATCH_UPDATE_SITUATION',
		situation,
	} as const)

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit,
	} as const)

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
