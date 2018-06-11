import { popularTargetNames } from 'Components/TargetSelection'
import computeThemeColours from 'Components/themeColours'
import { defaultTo, without } from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import storageReducer from '../storage/reducer'

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

function lang(state = null, { type, lang }) {
	switch (type) {
		case 'SWITCH_LANG':
			return lang
		default:
			return state
	}
}

function conversationSteps(
	state = { foldedSteps: [], currentQuestion: null },
	{ type, name, step }
) {
	if (type === 'RESET_SIMULATION') return { foldedSteps: [], unfolded: null }
	if (type !== 'STEP_ACTION') return state

	if (name === 'fold') return { foldedSteps: [...state.foldedSteps, step] }
	if (name === 'unfold')
		return {
			foldedSteps: without([step], state.foldedSteps),
			unfoldedStep: step
		}
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

		iframe: defaultTo(false),

		themeColours,

		explainedVariable,
		previousSimulation: defaultTo(null),

		currentExample,
		conversationStarted,
		activeTargetInput
	})
)
