import { Action } from '@/actions/actions'
import { Commune } from '@/api/commune'
import { PreviousSimulation } from '@/selectors/previousSimulationSelectors'
import { DottedName } from 'modele-social'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { objectifsSelector } from '../selectors/simulationSelectors'
import { omit } from '../utils'
import choixStatutJuridique from './choixStatutJuridiqueReducer'
import { companySituation } from './companySituationReducer'
import previousSimulationRootReducer from './previousSimulationRootReducer'

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

type QuestionsKind = 'non prioritaires' | 'liste' | 'liste noire'

export type SimulationConfig = Partial<{
	objectifs:
		| Array<DottedName>
		| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>
	'objectifs cachés'?: Array<DottedName>
	situation: Simulation['situation']
	bloquant: Array<DottedName>
	questions: Partial<Record<QuestionsKind, Array<DottedName>>> & {
		"à l'affiche"?: Record<string, DottedName>
	}
	branches: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
	color: string
}>

type Overwrite<T, U> = { [P in keyof Omit<T, keyof U>]: T[P] } & U

export type Situation = Partial<
	Overwrite<
		Record<DottedName, string | number | { valeur: number; unité: string }>,
		{
			'établissement . localisation': { objet: Commune }
			'entreprise . imposition': string
			année: number
		}
	>
>

export type Simulation = {
	config: SimulationConfig
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
			const objectifs = objectifsSelector({
				simulation: state,
			} as RootState).filter((name) => name !== 'entreprise . charges')
			const situation = state.situation
			const { fieldName: dottedName, value } = action
			if (value === undefined) {
				return { ...state, situation: omit(situation, dottedName) }
			}
			if (objectifs.includes(dottedName)) {
				const objectifsToReset = objectifs.filter((name) => name !== dottedName)
				const newSituation = Object.fromEntries(
					Object.entries(situation).filter(
						([dottedName]) =>
							!objectifsToReset.some((o) => dottedName.startsWith(o))
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
