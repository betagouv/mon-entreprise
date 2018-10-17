/* @flow */

import {
	compose,
	defaultTo,
	isNil,
	lensPath,
	over,
	set,
	uniq,
	without
} from 'ramda'
// $FlowFixMe
import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
// $FlowFixMe
import { reducer as formReducer } from 'redux-form'
import computeThemeColours from 'Ui/themeColours'
import { simulationTargetNames } from '../config.js'
import defaultLang from '../i18n'
import inFranceAppReducer from './inFranceAppReducer'
import storageReducer from './storageReducer'
import type { Action } from 'Types/ActionsTypes'

// TODO : use context API instead
function themeColours(state = computeThemeColours(), { type, colour }) {
	if (type == 'CHANGE_THEME_COLOUR') return computeThemeColours(colour)
	else return state
}

function explainedVariable(state = null, { type, variableName = null }) {
	switch (type) {
		case 'EXPLAIN_VARIABLE':
			return variableName
		default:
			return state
	}
}

function currentExample(state = null, { type, situation, name, dottedName }) {
	switch (type) {
		case 'SET_EXAMPLE':
			return name != null ? { name, situation, dottedName } : null
		default:
			return state
	}
}

function conversationStarted(state = false, action: Action) {
	switch (action.type) {
		case 'START_CONVERSATION':
			return true
		case 'RESET_SIMULATION':
			return false
		default:
			return state
	}
}
function activeTargetInput(state = null, { type, name }) {
	switch (type) {
		case 'SET_ACTIVE_TARGET_INPUT':
			return name
		case 'RESET_SIMULATION':
			return null
		default:
			return state
	}
}

function lang(state = defaultLang, { type, lang }) {
	switch (type) {
		case 'SWITCH_LANG':
			return lang
		default:
			return state
	}
}

type ConversationSteps = {|
	+foldedSteps: Array<string>,
	+unfoldedStep: ?string,
	+priorityNamespace: ?string
|}

function conversationSteps(
	state: ConversationSteps = {
		foldedSteps: [],
		unfoldedStep: null,
		priorityNamespace: null
	},
	action: Action
): ConversationSteps {
	if (action.type === 'RESET_SIMULATION')
		return { foldedSteps: [], unfoldedStep: null, priorityNamespace: null }
	if (action.type === 'START_CONVERSATION' && action.priorityNamespace)
		return {
			foldedSteps: state.foldedSteps,
			unfoldedStep: null,
			priorityNamespace: action.priorityNamespace
		}

	if (action.type !== 'STEP_ACTION') return state
	const { name, step } = action
	if (name === 'fold')
		return {
			foldedSteps: [...state.foldedSteps, step],
			unfoldedStep: null,
			priorityNamespace: state.priorityNamespace
		}
	if (name === 'unfold') {
		// if a step had already been unfolded, bring it back !
		return {
			foldedSteps: [
				...without([step], state.foldedSteps),
				...(state.unfoldedStep ? [state.unfoldedStep] : [])
			],

			unfoldedStep: step,
			priorityNamespace: state.priorityNamespace
		}
	}
	return state
}
function hiddenControls(state = [], { type, id }) {
	if (type === 'HIDE_CONTROL') {
		return [...state, id]
	} else return state
}

const addAnswerToSituation = (dottedName, value, state) => {
	const dottedPath = dottedName.split(' . ')
	return compose(
		set(lensPath(['form', 'conversation', 'values', ...dottedPath]), value),
		over(lensPath(['conversationSteps', 'foldedSteps']), (steps = []) =>
			uniq([...steps, dottedName])
		)
	)(state)
}

const existingCompanyReducer = (state, action) => {
	if (action.type !== 'SAVE_EXISTING_COMPANY_DETAILS') {
		return state
	}
	const details = action.details
	let newState = state
	if (details.localisation) {
		newState = addAnswerToSituation(
			'établissement . localisation',
			JSON.stringify(details.localisation),
			newState
		)
	}
	if (!isNil(details.effectif)) {
		newState = addAnswerToSituation(
			'entreprise . effectif',
			details.effectif,
			newState
		)
	}
	return newState
}
export default reduceReducers(
	existingCompanyReducer,
	storageReducer,
	combineReducers({
		sessionId: defaultTo(Math.floor(Math.random() * 1000000000000) + ''),
		//  this is handled by redux-form, pas touche !
		form: formReducer,
		conversationSteps,
		lang,
		targetNames: defaultTo(simulationTargetNames),
		themeColours,
		explainedVariable,
		previousSimulation: defaultTo(null),
		currentExample,
		hiddenControls,
		conversationStarted,
		activeTargetInput,
		inFranceApp: inFranceAppReducer
	})
)
