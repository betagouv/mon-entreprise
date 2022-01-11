import { Action } from 'Actions/actions'
import { getCompanySituation } from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import { Names } from 'modele-social/dist/names'
import { defaultTo, without } from 'ramda'
import { omit } from '../utils'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { PreviousSimulation } from 'Selectors/previousSimulationSelectors'
import { objectifsSelector } from '../selectors/simulationSelectors'
import inFranceAppReducer from './inFranceAppReducer'
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

type QuestionsKind =
	| "à l'affiche"
	| 'non prioritaires'
	| 'liste'
	| 'liste noire'

export type SimulationConfig = Partial<{
	objectifs:
		| Array<DottedName>
		| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>
	'objectifs cachés'?: Array<DottedName>
	situation: Simulation['situation']
	bloquant: Array<DottedName>
	questions: Partial<Record<QuestionsKind, Array<DottedName>>>
	branches: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
	color: string
}>

export type Situation = Partial<Record<DottedName, any>>
export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenNotifications: Array<string>
	situation: Situation
	initialSituation: Situation
	targetUnit: string
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
}

function simulation(
	state: Simulation | null = null,
	action: Action
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const { config, url, initialSituation } = action
		return {
			config,
			url,
			hiddenNotifications: [],
			situation: initialSituation ?? {},
			initialSituation: initialSituation ?? {},
			targetUnit: config['unité par défaut'] || '€/mois',
			foldedSteps: Object.keys(initialSituation ?? {}) as Array<Names>,
			unfoldedStep: null,
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
				situation: state.initialSituation,
				foldedSteps: [],
				unfoldedStep: null,
			}
		case 'BATCH_UPDATE_SITUATION': {
			return (
				Object.entries(action.situation as any) as Array<[Names, unknown]>
			).reduce<Simulation | null>(
				(newState, [fieldName, value]) =>
					simulation(newState, {
						type: 'UPDATE_SITUATION',
						fieldName,
						value,
					}),
				state
			)
		}
		case 'UPDATE_SITUATION': {
			const objectifs = without(
				['entreprise . charges'],
				objectifsSelector({ simulation: state } as RootState)
			)
			const situation = state.situation
			const { fieldName: dottedName, value } = action
			if (value === undefined) {
				return { ...state, situation: omit(situation, dottedName) }
			}
			if (objectifs.includes(dottedName)) {
				const objectifsToReset = without([dottedName], objectifs)
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
		case 'STEP_ACTION': {
			const { name, step } = action
			if (name === 'fold')
				return {
					...state,
					foldedSteps: [...state.foldedSteps, step],
					unfoldedStep: null,
				}
			if (name === 'unfold') {
				return {
					...state,
					foldedSteps: without([step], state.foldedSteps),
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
	}
	return state
}
const existingCompanyReducer = (state: RootState, action: Action) => {
	if (action.type.startsWith('EXISTING_COMPANY::') && state.simulation) {
		return {
			...state,
			simulation: {
				...state.simulation,
				situation: {
					...state.simulation.situation,
					...getCompanySituation(state.inFranceApp.existingCompany),
				},
			},
		}
	}
	return state
}
const mainReducer = combineReducers({
	explainedVariable,
	simulation,
	previousSimulation: defaultTo(null) as Reducer<PreviousSimulation | null>,
	activeTargetInput,
	inFranceApp: inFranceAppReducer,
})

export default reduceReducers<RootState>(
	mainReducer as any,
	existingCompanyReducer as Reducer<RootState>,
	previousSimulationRootReducer as Reducer<RootState>
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
