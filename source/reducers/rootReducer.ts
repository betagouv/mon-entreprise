import { Action } from 'Actions/actions'
import { findRuleByDottedName } from 'Engine/rules'
import {
	compose,
	defaultTo,
	dissoc,
	identity,
	lensPath,
	omit,
	over,
	set,
	uniq,
	without
} from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { targetNamesSelector } from 'Selectors/analyseSelectors'
import { SavedSimulation } from 'Selectors/storageSelectors'
import { DottedName, Rule } from 'Types/rule'
import i18n, { AvailableLangs } from '../i18n'
import inFranceAppReducer from './inFranceAppReducer'
import storageRootReducer from './storageReducer'

function explainedVariable(
	state: DottedName = null,
	action: Action
): DottedName {
	switch (action.type) {
		case 'EXPLAIN_VARIABLE':
			return action.variableName
		case 'STEP_ACTION':
			return null
		default:
			return state
	}
}

function currentExample(state = null, action: Action) {
	switch (action.type) {
		case 'SET_EXAMPLE':
			const { situation, name, dottedName } = action
			return name != null ? { name, situation, dottedName } : null
		default:
			return state
	}
}

function situationBranch(state: number = null, action: Action): number {
	switch (action.type) {
		case 'SET_SITUATION_BRANCH':
			return action.id
		default:
			return state
	}
}

function activeTargetInput(
	state: DottedName | null = null,
	action: Action
): DottedName | null {
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
	foldedSteps: Array<string>
	unfoldedStep?: string
}

function conversationSteps(
	state: ConversationSteps = {
		foldedSteps: [],
		unfoldedStep: null
	},
	action: Action
): ConversationSteps {
	if (action.type === 'RESET_SIMULATION')
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

function updateSituation(situation, { fieldName, value, config, rules }) {
	const goals = targetNamesSelector({ simulation: { config } } as any).filter(
		dottedName => {
			const target = rules.find(r => r.dottedName === dottedName)
			const isSmallTarget = !target.question || !target.formule
			return !isSmallTarget
		}
	)
	const removePreviousTarget = goals.includes(fieldName)
		? omit(goals)
		: identity
	return { ...removePreviousTarget(situation), [fieldName]: value }
}

function updatePeriod(situation, { toPeriod, rules }) {
	const currentPeriod = situation['période']
	if (currentPeriod === toPeriod) {
		return situation
	}
	if (!['mois', 'année'].includes(toPeriod)) {
		throw new Error('Oups, changement de période invalide')
	}

	const needConversion = Object.keys(situation).filter(dottedName => {
		const rule = findRuleByDottedName(rules, dottedName)
		return rule?.période === 'flexible'
	})

	const updatedSituation = Object.entries(situation)
		.filter(([fieldName]) => needConversion.includes(fieldName))
		.map(([fieldName, value]) => [
			fieldName,
			currentPeriod === 'mois' && toPeriod === 'année'
				? (value as number) * 12
				: (value as number) / 12
		])

	return {
		...situation,
		...Object.fromEntries(updatedSituation),
		période: toPeriod
	}
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
}>

export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenControls: Array<string>
	situation: Record<DottedName, any>
}

function simulation(
	state: Simulation = null,
	action: Action,
	rules: Array<Rule>
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const { config, url } = action
		return { config, url, hiddenControls: [], situation: {} }
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
					config: state.config,
					rules
				})
			}
		case 'UPDATE_PERIOD':
			return {
				...state,
				situation: updatePeriod(state.situation, {
					toPeriod: action.toPeriod,
					rules
				})
			}
	}
	return state
}

const addAnswerToSituation = (
	dottedName: DottedName,
	value: any,
	state: RootState
) => {
	console.log(state)
	return (compose(
		set(lensPath(['simulation', 'config', 'situation', dottedName]), value),
		over(lensPath(['conversationSteps', 'foldedSteps']), (steps = []) =>
			uniq([...steps, dottedName])
		) as any
	) as any)(state)
}

const removeAnswerFromSituation = (
	dottedName: DottedName,
	state: RootState
) => {
	return (compose(
		over(lensPath(['simulation', 'config', 'situation']), dissoc(dottedName)),
		over(
			lensPath(['conversationSteps', 'foldedSteps']),
			without([dottedName])
		) as any
	) as any)(state)
}

const existingCompanyRootReducer = (state: RootState, action): RootState => {
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
		simulation: (a: Simulation | null, b: Action) =>
			simulation(a, b, state.rules),
		previousSimulation: defaultTo(null) as Reducer<SavedSimulation>,
		currentExample,
		situationBranch,
		activeTargetInput,
		inFranceApp: inFranceAppReducer
	})(state, action)

export default reduceReducers(
	existingCompanyRootReducer,
	storageRootReducer,
	mainReducer
)

export type RootState = ReturnType<typeof mainReducer>
