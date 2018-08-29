/* @flow */

import { popularTargetNames } from 'Components/TargetSelection'
import { defaultTo, without } from 'ramda'
// $FlowFixMe
import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
// $FlowFixMe
import { reducer as formReducer } from 'redux-form'
import computeThemeColours from 'Ui/themeColours'
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
	+unfoldedStep: ?string
|}

function conversationSteps(
	state: ConversationSteps = { foldedSteps: [], unfoldedStep: null },
	action: Action
): ConversationSteps {
	if (action.type === 'RESET_SIMULATION')
		return { foldedSteps: [], unfoldedStep: null }
	if (action.type === 'START_CONVERSATION' && action.question)
		return { foldedSteps: state.foldedSteps, unfoldedStep: action.question }

	if (action.type !== 'STEP_ACTION') return state
	const { name, step } = action
	if (name === 'fold')
		return { foldedSteps: [...state.foldedSteps, step], unfoldedStep: null }
	if (name === 'unfold') {
		// if a step had already been unfolded, bring it back !
		return {
			foldedSteps: [
				...without([step], state.foldedSteps),
				...(state.unfoldedStep ? [state.unfoldedStep] : [])
			],

			unfoldedStep: step
		}
	}
	return state
}

export default reduceReducers(
	storageReducer,
	combineReducers({
		sessionId: defaultTo(Math.floor(Math.random() * 1000000000000) + ''),
		//  this is handled by redux-form, pas touche !
		form: formReducer,
		conversationSteps,
		lang,
		targetNames: defaultTo(popularTargetNames),
		themeColours,
		explainedVariable,
		previousSimulation: defaultTo(null),
		currentExample,
		conversationStarted,
		activeTargetInput,
		inFranceApp: inFranceAppReducer
	})
)
