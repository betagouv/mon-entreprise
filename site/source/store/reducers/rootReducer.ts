import * as O from 'effect/Option'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { Action, enregistreLaRéponseÀLaQuestion } from '@/store/actions/actions'
import { simulationReducer } from '@/store/reducers/simulation.reducer'
import { PreviousSimulation } from '@/store/selectors/previousSimulationSelectors'
import situationReducer from '@/store/slices/simulateursSlice'

import { companySituation } from './companySituationReducer'
import previousSimulationRootReducer from './previousSimulationRootReducer'

export type { SimulationConfig, SituationPublicodes }

function activeTargetInput(state: DottedName | null = null, action: Action) {
	switch (action.type) {
		case 'SET_ACTIVE_TARGET':
			return action.name
		case 'RÉINITIALISE_LA_SIMULATION':
			return null
		default:
			return state
	}
}

function batchUpdateSituationReducer(state: RootState, action: Action) {
	if (action.type !== 'ENREGISTRE_LES_RÉPONSES_AUX_QUESTIONS') {
		return state
	}

	return Object.entries(action.situation).reduce<RootState | null>(
		(newState, [fieldName, value]) =>
			mainReducer(
				newState ?? undefined,
				enregistreLaRéponseÀLaQuestion(
					fieldName as DottedName,
					O.getOrUndefined(value)
				)
			),
		state
	)
}

const mainReducer = combineReducers({
	simulation: simulationReducer,
	companySituation,
	previousSimulation: ((p) => p ?? null) as Reducer<PreviousSimulation | null>,
	activeTargetInput,
	situation: situationReducer,
})

export default reduceReducers<RootState>(
	mainReducer as Reducer<RootState>,
	batchUpdateSituationReducer as Reducer<RootState>,
	previousSimulationRootReducer as Reducer<RootState>
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
