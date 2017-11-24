import R from 'ramda'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { reducer as formReducer, formValueSelector } from 'redux-form'

import {
	rules,
	findRuleByName,
	collectDefaults,
	nameLeaf,
	formatInputs
} from 'Engine/rules'
import { nextSteps } from 'Engine/generateQuestions'
import computeThemeColours from 'Components/themeColours'
import {
	STEP_ACTION,
	START_CONVERSATION,
	EXPLAIN_VARIABLE,
	CHANGE_THEME_COLOUR
} from './actions'

import { analyse } from 'Engine/traverse'

import ReactPiwik from 'Components/Tracker'

// assume "wraps" a given situation function with one that overrides its values with
// the given assumptions
let assume = (evaluator, assumptions) => state => name => {
	let userInput = evaluator(state)(name)
	return userInput != null ? userInput : assumptions[name]
}

export let reduceSteps = (tracker, flatRules, answerSource) => (
	state,
	action
) => {
	if (![START_CONVERSATION, STEP_ACTION].includes(action.type)) return state

	let targetNames =
		action.type == START_CONVERSATION ? action.targetNames : state.targetNames

	let sim =
			targetNames.length === 1 ? findRuleByName(flatRules, targetNames[0]) : {},
		// Hard assumptions cannot be changed, they are used to specialise a simulator
		// before the user sees the first question
		hardAssumptions = R.pathOr({}, ['simulateur', 'hypothèses'], sim),
		intermediateSituation = assume(answerSource, hardAssumptions),
		// Most rules have default values
		rulesDefaults = collectDefaults(flatRules),
		situationWithDefaults = assume(intermediateSituation, rulesDefaults)

	let
		parsedRules = R.path(['analysis', 'parsedRules'], state),
		analysis = analyse(parsedRules || flatRules, targetNames)(situationWithDefaults(state)),
		next = nextSteps(situationWithDefaults(state), flatRules, analysis),
		assumptionsMade = !R.isEmpty(rulesDefaults),
		done = next.length == 0,
		currentQuestion =
			done && assumptionsMade
				? // The simulation is "over" - except we can now fill in extra questions
					// where the answers were previously given default reasonable assumptions
					do {
						let
							reanalysis = analyse(analysis.parsedRules, targetNames)(
								intermediateSituation(state)
							),
							next = nextSteps(intermediateSituation(state), flatRules, reanalysis)
						R.head(next)
					}
				: R.head(next)

	let newState = {
		...state,
		targetNames,
		analysis,
		situationGate: situationWithDefaults(state),
		explainedVariable: null,
		currentQuestion
	}

	if (action.type == START_CONVERSATION) {
		return {
			...newState,
			// when objectives change, reject theme from answered questions
			foldedSteps: R.reject(name => targetNames.includes(nameLeaf(name)))(
				state.foldedSteps
			)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'fold') {
		tracker.push([
			'trackEvent',
			'answer',
			action.step + ': ' + situationWithDefaults(state)(action.step)
		])

		return {
			...newState,
			foldedSteps: [...state.foldedSteps, state.currentQuestion]
		}
	}
	if (action.type == STEP_ACTION && action.name == 'unfold') {
		tracker.push(['trackEvent', 'unfold', action.step])

		// We are possibly "refolding" a previously open question
		let previous = state.currentQuestion,
			// we fold it back into foldedSteps if it had been answered
			answered = previous && answerSource(state)(previous) != undefined,
			foldedSteps = answered
				? R.concat(state.foldedSteps, [previous])
				: state.foldedSteps

		return {
			...newState,
			foldedSteps: R.without([action.step], foldedSteps),
			currentQuestion: action.step
		}
	}
}

function themeColours(state = computeThemeColours(), { type, colour }) {
	if (type == CHANGE_THEME_COLOUR) return computeThemeColours(colour)
	else return state
}

function explainedVariable(state = null, { type, variableName = null }) {
	switch (type) {
	case EXPLAIN_VARIABLE:
		return variableName
	default:
		return state
	}
}

export default reduceReducers(
	combineReducers({
		sessionId: (id = Math.floor(Math.random() * 1000000000000) + '') => id,
		//  this is handled by redux-form, pas touche !
		form: formReducer,

		/* Have forms been filled or ignored ?
		false means the user is reconsidering its previous input */
		foldedSteps: (steps = []) => steps,
		currentQuestion: (state = null) => state,

		analysis: (state = null) => state,

		targetNames: (state = null) => state,

		situationGate: (state = name => null) => state,
		refine: (state = false) => state,

		themeColours,

		explainedVariable
	}),
	// cross-cutting concerns because here `state` is the whole state tree
	reduceSteps(ReactPiwik, rules, formatInputs(rules, formValueSelector))
)
