import { popularTargetNames } from 'Components/TargetSelection'
import computeThemeColours from 'Components/themeColours'
import { formatInputs } from 'Engine/rules'
import { always, defaultTo } from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
import { formValueSelector, reducer as formReducer } from 'redux-form'
import storageReducer from '../storage/reducer'
import reduceSteps from './reduceSteps'

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

function currentExample(state = null, { type, situation, name }) {
	switch (type) {
		case 'SET_EXAMPLE':
			return name != null ? { name, situation } : null
		default:
			return state
	}
}

function conversationStarted(state = false, { type }) {
	switch (type) {
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
function foldedSteps(state = [], { type }) {
	switch (type) {
		case 'RESET_SIMULATION':
			return []
		default:
			return state
	}
}

function analysis(state = null, { type }) {
	switch (type) {
		case 'RESET_SIMULATION':
			return null
		default:
			return state
	}
}
export default initialRules =>
	reduceReducers(
		storageReducer,
		combineReducers({
			sessionId: defaultTo(Math.floor(Math.random() * 1000000000000) + ''),
			//  this is handled by redux-form, pas touche !
			form: formReducer,

			/* Have forms been filled or ignored ?
		false means the user is reconsidering its previous input */
			foldedSteps,
			currentQuestion: defaultTo(null),
			nextSteps: defaultTo([]),
			missingVariablesByTarget: defaultTo({}),
			parsedRules: defaultTo(null),
			flatRules: defaultTo(null),
			analysis,

			targetNames: defaultTo(popularTargetNames),

			situationGate: defaultTo(always(null)),

			iframe: defaultTo(false),

			themeColours,

			explainedVariable,
			previousSimulation: defaultTo(null),

			currentExample,
			conversationStarted,
			activeTargetInput
		}),
		// cross-cutting concerns because here `state` is the whole state tree
		reduceSteps(initialRules, formatInputs(initialRules, formValueSelector))
	)
