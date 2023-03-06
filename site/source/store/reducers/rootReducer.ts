import { DottedName } from 'modele-social'
import reduceReducers from 'reduce-reducers'
import { Reducer, combineReducers } from 'redux'

import { SimulationConfig, Situation } from '@/pages/simulateurs/_configs/types'
import { Action } from '@/store/actions/actions'
import { PreviousSimulation } from '@/store/selectors/previousSimulationSelectors'
import { ImmutableType } from '@/types/utils'
import { objectTransform, omit } from '@/utils'

import choixStatutJuridique from './choixStatutJuridiqueReducer'
import { companySituation } from './companySituationReducer'
import previousSimulationRootReducer from './previousSimulationRootReducer'

export type { SimulationConfig, Situation }

function explainedVariable(
	state: DottedName | null = null,
	action: Action
): DottedName | null {
	switch (action.type) {
		case 'EXPLAIN_VARIABLE':
			return action.variableName
		case 'STEP_ACTION':
			return null
		default:
			return state
	}
}

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

export type Simulation = {
	config: ImmutableType<SimulationConfig>
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	targetUnit: string
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
	shouldFocusField: boolean
}

function simulation(
	state: Simulation | null = null,
	action: Action
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const { config, url } = action

		return {
			config,
			url,
			hiddenNotifications: [],
			situation: {},
			targetUnit: config['unité par défaut'] || '€/mois',
			foldedSteps: [],
			unfoldedStep: null,
			shouldFocusField: false,
		}
	}

	if (state === null) {
		return state
	}

	switch (action.type) {
		case 'HIDE_NOTIFICATION':
			return {
				...state,
				hiddenNotifications: [...state.hiddenNotifications, action.id],
			}
		case 'RESET_SIMULATION':
			return {
				...state,
				hiddenNotifications: [],
				situation: {},
				foldedSteps: [],
				unfoldedStep: null,
			}

		case 'UPDATE_SITUATION': {
			const situation = state.situation
			const { fieldName: dottedName, value } = action

			if (value === undefined) {
				return { ...state, situation: omit(situation, dottedName) }
			}

			const objectifsExclusifs = state.config['objectifs exclusifs'] ?? []

			if (objectifsExclusifs.includes(dottedName)) {
				const objectifsToReset = objectifsExclusifs.filter(
					(name) => name !== dottedName
				)

				const newSituation = objectTransform(situation, (entries) =>
					entries.filter(
						([dottedName]) =>
							!objectifsToReset.includes(dottedName as DottedName)
					)
				)

				return { ...state, situation: { ...newSituation, [dottedName]: value } }
			}

			return { ...state, situation: { ...situation, [dottedName]: value } }
		}
		case 'DELETE_FROM_SITUATION': {
			const newState = {
				...state,
				situation: omit(
					state.situation,
					action.fieldName
				) as Simulation['situation'],
			}

			return newState
		}
		case 'STEP_ACTION': {
			const { name, step } = action
			if (name === 'fold') {
				return {
					...state,
					foldedSteps: [...state.foldedSteps, step],
					unfoldedStep: null,
				}
			}
			if (name === 'unfold') {
				return {
					...state,
					foldedSteps: state.foldedSteps.filter((name) => name !== step),
					unfoldedStep: step,
				}
			}

			return state
		}
		case 'UPDATE_TARGET_UNIT':
			return {
				...state,
				targetUnit: action.targetUnit,
			}

		case 'UPDATE_SHOULD_FOCUS_FIELD':
			return {
				...state,
				shouldFocusField: action.shouldFocusField,
			}
	}

	return state
}

function batchUpdateSituationReducer(state: RootState, action: Action) {
	if (action.type !== 'BATCH_UPDATE_SITUATION') {
		return state
	}

	return Object.entries(action.situation).reduce<RootState | null>(
		(newState, [fieldName, value]) =>
			mainReducer(newState ?? undefined, {
				type: 'UPDATE_SITUATION',
				fieldName,
				value,
			}),
		state
	)
}

const mainReducer = combineReducers({
	explainedVariable,
	simulation,
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
