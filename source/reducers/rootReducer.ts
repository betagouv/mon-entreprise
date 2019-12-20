import { Action } from 'Actions/actions'
import { Analysis } from 'Engine/traverse'
import { areUnitConvertible, convertUnit, parseUnit, Unit } from 'Engine/units'
import {
	defaultTo,
	dissoc,
	identity,
	lensPath,
	omit,
	over,
	pipe,
	set,
	uniq,
	without
} from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { SavedSimulation } from 'Selectors/storageSelectors'
import { DottedName, Rule } from 'Types/rule'
import i18n, { AvailableLangs } from '../i18n'
import inFranceAppReducer from './inFranceAppReducer'
import storageRootReducer from './storageReducer'

function explainedVariable(state: DottedName | null = null, action: Action) {
	switch (action.type) {
		case 'EXPLAIN_VARIABLE':
			return action.variableName
		case 'STEP_ACTION':
			return null
		default:
			return state
	}
}

type Example = null | {
	name: string
	situation: object
	dottedName: DottedName
	defaultUnits?: Array<Unit>
}

function currentExample(state: Example = null, action: Action): Example {
	switch (action.type) {
		case 'SET_EXAMPLE':
			return action.name != null ? action : null
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

function lang(
	state = i18n.language as AvailableLangs,
	{ type, lang }
): AvailableLangs {
	switch (type) {
		case 'SWITCH_LANG':
			return lang
		default:
			return state
	}
}

type ConversationSteps = {
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
}

function conversationSteps(
	state: ConversationSteps = {
		foldedSteps: [],
		unfoldedStep: null
	},
	action: Action
): ConversationSteps {
	if (['RESET_SIMULATION', 'SET_SIMULATION'].includes(action.type))
		return { foldedSteps: [], unfoldedStep: null }

	if (action.type !== 'STEP_ACTION') return state
	const { name, step } = action
	if (name === 'fold')
		return {
			foldedSteps: [...state.foldedSteps, step],
			unfoldedStep: null
		}
	if (name === 'unfold') {
		return {
			foldedSteps: without([step], state.foldedSteps),
			unfoldedStep: step
		}
	}
	return state
}

function updateSituation(
	situation,
	{
		fieldName,
		value,
		analysis
	}: {
		fieldName: DottedName
		value: any
		analysis: Analysis | Array<Analysis> | null
	}
) {
	const goals =
		analysis &&
		(Array.isArray(analysis) ? analysis[0] : analysis).targets
			.map(target => target.explanation || target)
			.filter(target => !!target.formule == !!target.question)
			.map(({ dottedName }) => dottedName)
	const removePreviousTarget = goals?.includes(fieldName)
		? omit(goals)
		: identity
	return { ...removePreviousTarget(situation), [fieldName]: value }
}

function updateDefaultUnit(situation, { toUnit, analysis }) {
	const unit = parseUnit(toUnit)

	const convertedSituation = Object.keys(situation)
		.map(
			dottedName =>
				analysis.targets.find(target => target.dottedName === dottedName) ||
				analysis.cache[dottedName]
		)
		.filter(
			rule =>
				(rule.unit || rule.defaultUnit) &&
				!rule.unité &&
				areUnitConvertible(rule.unit || rule.defaultUnit, unit)
		)
		.reduce(
			(convertedSituation, rule) => ({
				...convertedSituation,
				[rule.dottedName]: convertUnit(
					rule.unit || rule.defaultUnit,
					unit,
					situation[rule.dottedName]
				)
			}),
			situation
		)
	return convertedSituation
}

type QuestionsKind =
	| "à l'affiche"
	| 'non prioritaires'
	| 'uniquement'
	| 'liste noire'

export type SimulationConfig = Partial<{
	objectifs:
		| Array<DottedName>
		| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>
	questions: Partial<Record<QuestionsKind, Array<DottedName>>>
	bloquant: Array<DottedName>
	situation: Simulation['situation']
	branches: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unités par défaut': [string]
}>

export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenControls: Array<string>
	situation: Partial<Record<DottedName, any>>
	defaultUnits: [string]
}

function simulation(
	state: Simulation | null = null,
	action: Action,
	analysis: Analysis | Array<Analysis> | null
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const { config, url } = action
		if (state && state.config === config) {
			return state
		}
		return {
			config,
			url,
			hiddenControls: [],
			situation: {},
			defaultUnits: config['unités par défaut'] || ['€/mois']
		}
	}
	if (state === null) {
		return state
	}
	switch (action.type) {
		case 'HIDE_CONTROL':
			return { ...state, hiddenControls: [...state.hiddenControls, action.id] }
		case 'RESET_SIMULATION':
			return { ...state, hiddenControls: [], situation: {} }
		case 'UPDATE_SITUATION':
			return {
				...state,
				situation: updateSituation(state.situation, {
					fieldName: action.fieldName,
					value: action.value,
					analysis
				})
			}
		case 'UPDATE_DEFAULT_UNIT':
			return {
				...state,
				defaultUnits: [action.defaultUnit],
				situation: updateDefaultUnit(state.situation, {
					toUnit: action.defaultUnit,
					analysis
				})
			}
	}
	return state
}

const addAnswerToSituation = (
	dottedName: DottedName,
	value: unknown,
	state: RootState
) => {
	return pipe(
		over(lensPath(['conversationSteps', 'foldedSteps']), (steps = []) =>
			uniq([...steps, dottedName])
		),
		set(lensPath(['simulation', 'situation', dottedName]), value)
	)(state)
}

const removeAnswerFromSituation = (
	dottedName: DottedName,
	state: RootState
) => {
	return pipe(
		over(lensPath(['conversationSteps', 'foldedSteps']), without([dottedName])),
		over(lensPath(['simulation', 'situation']), dissoc(dottedName))
	)(state)
}

const existingCompanyRootReducer = (state: RootState, action) => {
	if (!action.type.startsWith('EXISTING_COMPANY::')) {
		return state
	}
	if (action.type.endsWith('ADD_COMMUNE_DETAILS')) {
		return addAnswerToSituation(
			'établissement . localisation',
			JSON.stringify(action.details.localisation),
			state
		)
	}
	if (action.type.endsWith('RESET')) {
		removeAnswerFromSituation('établissement . localisation', state)
	}
	return state
}

const mainReducer = (state, action: Action) =>
	combineReducers({
		conversationSteps,
		lang,
		rules: defaultTo(null) as Reducer<Array<Rule>>,
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(a, b, a && analysisWithDefaultsSelector(state)),
		previousSimulation: defaultTo(null) as Reducer<SavedSimulation | null>,
		currentExample,
		situationBranch,
		activeTargetInput,
		inFranceApp: inFranceAppReducer
	})(state, action)

export default reduceReducers<RootState>(
	existingCompanyRootReducer,
	mainReducer as any,
	storageRootReducer as any
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
