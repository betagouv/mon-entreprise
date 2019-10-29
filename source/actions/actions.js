import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction,
	StepAction,
	DeletePreviousSimulationAction,
	SetSimulationConfigAction,
	SetSituationBranchAction
} from 'Types/ActionsTypes'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import type { Thunk } from 'Types/ActionsTypes'

export const resetSimulation = () => (dispatch: any => void): void => {
	dispatch(
		({
			type: 'RESET_SIMULATION'
		}: ResetSimulationAction)
	)
}

export const goToQuestion = (question: string): StepAction => ({
	type: 'STEP_ACTION',
	name: 'unfold',
	step: question
})

export const validateStepWithValue = (
	dottedName,
	value: any
): Thunk<StepAction> => dispatch => {
	dispatch(updateSituation(dottedName, value))
	dispatch({
		type: 'STEP_ACTION',
		name: 'fold',
		step: dottedName
	})
}

export const setSituationBranch = (id: number): SetSituationBranchAction => ({
	type: 'SET_SITUATION_BRANCH',
	id
})

export const setSimulationConfig = (
	config: Object
): Thunk<SetSimulationConfigAction> => (dispatch, _, { history }): void => {
	const url = history.location.pathname
	dispatch({
		type: 'SET_SIMULATION',
		url,
		config
	})
}

export const deletePreviousSimulation = () => (
	dispatch: DeletePreviousSimulationAction => void
) => {
	dispatch({
		type: 'DELETE_PREVIOUS_SIMULATION'
	})
	deletePersistedSimulation()
}

export const updateSituation = (fieldName, value) => ({
	type: 'UPDATE_SITUATION',
	fieldName,
	value
})

export const updatePeriod = toPeriod => ({
	type: 'UPDATE_PERIOD',
	toPeriod
})

// $FlowFixMe
export function setExample(name, situation, dottedName) {
	return { type: 'SET_EXAMPLE', name, situation, dottedName }
}

export const goBackToSimulation = (): Thunk<any> => (
	dispatch,
	getState,
	{ history }
) => {
	dispatch({ type: 'SET_EXEMPLE', name: null })
	history.push(getState().simulation.url)
}

export function loadPreviousSimulation(): LoadPreviousSimulationAction {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION'
	}
}

export function hideControl(id: string) {
	return { type: 'HIDE_CONTROL', id }
}

export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'
