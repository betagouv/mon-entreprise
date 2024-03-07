import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'

import { SimulationConfig, Situation } from '@/pages/simulateurs/_configs/types'
import {
	Action,
	updateSituation as updateSituationAction,
} from '@/store/actions/actions'
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
	answeredQuestions: Array<DottedName>
	currentQuestion?: DottedName | null
	shouldFocusField: boolean
}

export function simulation(
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
			answeredQuestions: [],
			currentQuestion: null,
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
				answeredQuestions: [],
				currentQuestion: null,
			}

		case 'ANSWER_QUESTION': {
			const foldedSteps = state.answeredQuestions.includes(action.dottedName)
				? state.answeredQuestions
				: [...state.answeredQuestions, action.dottedName]

			return {
				...state,
				answeredQuestions: foldedSteps,
				situation: updateSituation(
					state.config,
					state.situation,
					action.dottedName,
					action.value
				),
			}
		}

		case 'UPDATE_SITUATION': {
			return {
				...state,
				situation: updateSituation(
					state.config,
					state.situation,
					action.fieldName,
					action.value
				),
			}
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
		case 'PREVIOUS_QUESTION': {
			if (state.answeredQuestions.length === 0) {
				return state
			}

			const currentIndex = state.currentQuestion
				? state.answeredQuestions.indexOf(state.currentQuestion)
				: -1

			if (currentIndex === -1) {
				return {
					...state,
					currentQuestion: state.answeredQuestions.at(-1),
				}
			}

			const previousQuestion = state.answeredQuestions[currentIndex - 1]
			if (previousQuestion === undefined) {
				return state
			}

			return {
				...state,
				currentQuestion: previousQuestion,
			}
		}

		case 'NEXT_QUESTION': {
			return state
		}
		case 'STEP_ACTION': {
			const { name, step } = action
			if (name === 'fold') {
				const foldedSteps = state.answeredQuestions.includes(step)
					? state.answeredQuestions
					: [...state.answeredQuestions, step]

				return {
					...state,
					answeredQuestions: foldedSteps,
					currentQuestion: null,
				}
			}
			if (name === 'unfold') {
				return {
					...state,
					answeredQuestions: state.answeredQuestions,
					currentQuestion: step,
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
			mainReducer(
				newState ?? undefined,
				updateSituationAction(fieldName as DottedName, value)
			),
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

function updateSituation(
	config: ImmutableType<SimulationConfig>,
	currentSituation: Situation,
	dottedName: DottedName,
	value: PublicodesExpression | undefined
): Situation {
	if (value === undefined) {
		return omit(currentSituation, dottedName)
	}

	const objectifsExclusifs = config['objectifs exclusifs'] ?? []

	if (!objectifsExclusifs.includes(dottedName)) {
		return { ...currentSituation, [dottedName]: value }
	}

	const objectifsToReset = objectifsExclusifs.filter(
		(name) => name !== dottedName
	)

	const clearedSituation = objectTransform(currentSituation, (entries) =>
		entries.filter(
			([dottedName]) => !objectifsToReset.includes(dottedName as DottedName)
		)
	)

	return { ...clearedSituation, [dottedName]: value }
}
