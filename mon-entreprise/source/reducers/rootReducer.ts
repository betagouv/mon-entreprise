import { Action } from 'Actions/actions'
import { defaultTo, omit, without } from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { SavedSimulation } from 'Selectors/storageSelectors'
import { DottedName } from '../rules/index'
import { objectifsSelector } from '../selectors/simulationSelectors'
import inFranceAppReducer, { Company } from './inFranceAppReducer'
import storageRootReducer from './storageReducer'

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

function situationBranch(state: number | null = null, action: Action) {
	switch (action.type) {
		case 'SET_SITUATION_BRANCH':
			return action.id
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

export type SimulationConfig = {
	objectifs:
		| Array<DottedName>
		| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>
	'objectifs cachés': Array<DottedName>
	situation: Simulation['situation']
	bloquant?: Array<DottedName>
	questions?: Partial<Record<QuestionsKind, Array<DottedName>>>
	branches?: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
}

type Situation = Partial<Record<DottedName, any>>
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
function getCompanySituation(company: Company): Situation {
	return {
		...(company?.localisation && {
			'établissement . localisation': company.localisation
		}),
		...(company?.dateDeCréation && {
			'entreprise . date de création': company.dateDeCréation.replace(
				/(.*)-(.*)-(.*)/,
				'$3/$2/$1'
			)
		})
	}
}

function simulation(
	state: Simulation | null = null,
	action: Action,
	existingCompany: Company
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const companySituation = action.useCompanyDetails
			? getCompanySituation(existingCompany)
			: {}
		const { config, url } = action
		if (state && state.config === config) {
			return state
		}
		return {
			config,
			url,
			hiddenNotifications: [],
			situation: companySituation,
			initialSituation: companySituation,
			targetUnit: config['unité par défaut'] || '€/mois',
			foldedSteps: Object.keys(companySituation) as Array<DottedName>,
			unfoldedStep: null
		}
	}
	if (state === null) {
		return state
	}

	switch (action.type) {
		case 'HIDE_NOTIFICATION':
			return {
				...state,
				hiddenNotifications: [...state.hiddenNotifications, action.id]
			}
		case 'RESET_SIMULATION':
			return {
				...state,
				hiddenNotifications: [],
				situation: state.initialSituation,
				foldedSteps: [],
				unfoldedStep: null
			}
		case 'UPDATE_SITUATION': {
			const targets = without(
				['entreprise . charges'],
				objectifsSelector({ simulation: state } as RootState)
			)
			const situation = state.situation
			const { fieldName: dottedName, value } = action
			return {
				...state,
				situation:
					value === undefined
						? omit([dottedName], situation)
						: {
								...(targets.includes(dottedName)
									? omit(targets, situation)
									: situation),
								[dottedName]: value
						  }
			}
		}
		case 'STEP_ACTION': {
			const { name, step } = action
			if (name === 'fold')
				return {
					...state,
					foldedSteps: [...state.foldedSteps, step],
					unfoldedStep: null
				}
			if (name === 'unfold') {
				return {
					...state,
					foldedSteps: without([step], state.foldedSteps),
					unfoldedStep: step
				}
			}
			return state
		}
		case 'UPDATE_TARGET_UNIT':
			return {
				...state,
				targetUnit: action.targetUnit
			}
	}
	return state
}
const existingCompanyReducer = (state, action: Action) => {
	if (action.type.startsWith('EXISTING_COMPANY::') && state.simulation) {
		return {
			...state,
			simulation: {
				...state.simulation,
				situation: {
					...state.simulation.situation,
					...getCompanySituation(state.inFranceApp.existingCompany)
				}
			}
		}
	}
	return state
}
const mainReducer = (state, action: Action) =>
	combineReducers({
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(a, b, state?.inFranceApp?.existingCompany),
		previousSimulation: defaultTo(null) as Reducer<SavedSimulation | null>,
		situationBranch,
		activeTargetInput,
		inFranceApp: inFranceAppReducer
	})(state, action)

export default reduceReducers<RootState>(
	mainReducer as any,
	existingCompanyReducer as any,
	storageRootReducer as any
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
