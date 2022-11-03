import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'

import { SimulationConfig } from '@/reducers/rootReducer'
import { buildSituationFromObject } from '@/utils'

import { CompanyActions } from './companyActions'
import { CompanyCreationAction } from './companyCreationChecklistActions'
import { CompanyStatusAction } from './companyStatusActions'
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
			| typeof deleteFromSituation
			| typeof updateUnit
			| typeof batchUpdateSituation
			| typeof updateShouldFocusField
	  >
	| CompanyCreationAction
	| CompanyStatusAction
	| CompanyActions
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

export const setSimulationConfig = (config: SimulationConfig, url: string) =>
	({
		type: 'SET_SIMULATION',
		url,
		config,
	} as const)

export const setActiveTarget = (targetName: DottedName) =>
	({
		type: 'SET_ACTIVE_TARGET_INPUT',
		name: targetName,
	} as const)

export const updateSituation = (fieldName: DottedName, value: unknown) =>
	value === undefined
		? deleteFromSituation(fieldName)
		: ({
				type: 'UPDATE_SITUATION',
				fieldName,
				value,
		  } as const)

export const deleteFromSituation = (fieldName: DottedName) =>
	({
		type: 'DELETE_FROM_SITUATION',
		fieldName,
	} as const)

export const batchUpdateSituation = (
	situation: NonNullable<Parameters<Engine<DottedName>['setSituation']>[0]>
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

export const updateShouldFocusField = (shouldFocusField: boolean) =>
	({
		type: 'UPDATE_SHOULD_FOCUS_FIELD',
		shouldFocusField,
	} as const)

export const answerQuestion = (
	dottedName: DottedName,
	value:
		| PublicodesExpression
		| undefined
		| { batchUpdate: Record<string, PublicodesExpression> }
) => {
	if (value && typeof value === 'object' && 'batchUpdate' in value) {
		return batchUpdateSituation(
			buildSituationFromObject(
				dottedName,
				value.batchUpdate as Record<string, PublicodesExpression>
			)
		)
	}

	return (value == null ? deleteFromSituation : updateSituation)(
		dottedName,
		value
	)
}
