import { DottedName } from 'modele-social'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'

import { SimulationConfig } from '@/domaine/SimulationConfig'
import { Situation } from '@/domaine/Situation'
import {
	Action,
	enregistreLaRéponse as updateSituationAction,
} from '@/store/actions/actions'
import { simulationReducer } from '@/store/reducers/simulation.reducer'
import { PreviousSimulation } from '@/store/selectors/previousSimulationSelectors'

import choixStatutJuridique from './choixStatutJuridiqueReducer'
import { companySituation } from './companySituationReducer'
import previousSimulationRootReducer from './previousSimulationRootReducer'

export type { SimulationConfig, Situation }

function activeTargetInput(state: DottedName | null = null, action: Action) {
	switch (action.type) {
		case 'SET_ACTIVE_TARGET_INPUT':
			return action.name
		case 'RESET_SIMULATION':
			return null
		default:
			return state
	}
}

function batchUpdateSituationReducer(state: RootState, action: Action) {
	if (action.type !== 'BATCH_UPDATE_SITUATION') {
		return state
	}

	return Object.entries(action.situation).reduce<RootState | null>(
		(newState, [fieldName, value]) =>
			mainReducer(
				newState ?? undefined,
				updateSituationAction(fieldName as DottedName, value)
			),
		state
	)
}

const mainReducer = combineReducers({
	simulation: simulationReducer,
	companySituation,
	previousSimulation: ((p) => p ?? null) as Reducer<PreviousSimulation | null>,
	activeTargetInput,
	choixStatutJuridique,
})

export default reduceReducers<RootState>(
	mainReducer as Reducer<RootState>,
	batchUpdateSituationReducer as Reducer<RootState>,
	previousSimulationRootReducer as Reducer<RootState>
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
