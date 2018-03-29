import {
	head,
	isEmpty,
	pathOr,
	reject,
	contains,
	without,
	concat,
	length,
	reduce,
	assoc,
	map
} from 'ramda'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { reducer as formReducer, formValueSelector } from 'redux-form'

import {
	rules, rulesFr,
	enrichRule,
	findRuleByName,
	collectDefaults,
	formatInputs
} from 'Engine/rules'
import { getNextSteps } from 'Engine/generateQuestions'
import computeThemeColours from 'Components/themeColours'
import {
	STEP_ACTION,
	START_CONVERSATION,
	EXPLAIN_VARIABLE,
	CHANGE_THEME_COLOUR
} from './actions'

import { analyseMany, parseAll } from 'Engine/traverse'

import ReactPiwik from 'Components/Tracker'

// assume "wraps" a given situation function with one that overrides its values with
// the given assumptions
export let assume = (evaluator, assumptions) => state => name => {
	let userInput = evaluator(state)(name)
	return userInput != null ? userInput : assumptions[name]
}

let nextWithoutDefaults = (
	state,
	analysis,
	targetNames,
	intermediateSituation
) => {
	let reanalysis = analyseMany(state.parsedRules, targetNames)(
			intermediateSituation(state)
		),
		nextSteps = getNextSteps(intermediateSituation(state), reanalysis)

	return { currentQuestion: head(nextSteps), nextSteps }
}

export let reduceSteps = (tracker, flatRules, answerSource) => (
	state,
	action
) => {
	state.flatRules = flatRules
	// Optimization - don't parse on each analysis
	if (!state.parsedRules) {
		state.parsedRules = parseAll(flatRules)
	}

	if (
		![START_CONVERSATION, STEP_ACTION, 'USER_INPUT_UPDATE'].includes(
			action.type
		)
	)
		return state

	let targetNames =
		action.type == START_CONVERSATION
			? action.targetNames
			: state.targetNames || []

	let sim =
			targetNames.length === 1 ? findRuleByName(flatRules, targetNames[0]) : {},
		// Hard assumptions cannot be changed, they are used to specialise a simulator
		// before the user sees the first question
		hardAssumptions = pathOr({}, ['simulateur', 'hypothèses'], sim),
		intermediateSituation = assume(answerSource, hardAssumptions),
		// Most rules have default values
		rulesDefaults = collectDefaults(flatRules),
		situationWithDefaults = assume(intermediateSituation, rulesDefaults)

	let analysis = analyseMany(state.parsedRules, targetNames)(
		situationWithDefaults(state)
	)

	if (action.type === 'USER_INPUT_UPDATE') {
		return { ...state, analysis, situationGate: situationWithDefaults(state) }
	}

	let nextWithDefaults = getNextSteps(situationWithDefaults(state), analysis),
		assumptionsMade = !isEmpty(rulesDefaults),
		done = nextWithDefaults.length == 0

	let newState = {
		...state,
		targetNames,
		analysis,
		situationGate: situationWithDefaults(state),
		explainedVariable: null,
		done,
		...(done && assumptionsMade
			? // The simulation is "over" - except we can now fill in extra questions
			  // where the answers were previously given default reasonable assumptions
			  nextWithoutDefaults(state, analysis, targetNames, intermediateSituation)
			: {
					currentQuestion: head(nextWithDefaults),
					nextSteps: nextWithDefaults
			  })
	}

	if (action.type == START_CONVERSATION) {
		return {
			...newState,
			/* when objectives change, reject them from answered questions
			Hack : 'salaire de base' is the only inversable variable, so the only
			one that could be the next target AND already in the answered steps */
			foldedSteps: action.fromScratch
				? []
				: reject(contains('salaire de base'))(state.foldedSteps)
		}
	}

	if (action.type == STEP_ACTION && action.name == 'fold') {
		tracker.push([
			'trackEvent',
			'answer:' + action.source,
			action.step + ': ' + situationWithDefaults(state)(action.step)
		])

		if (!newState.currentQuestion) {
			tracker.push([
				'trackEvent',
				'done',
				'after' + length(newState.foldedSteps) + 'questions'
			])
		}

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
				? concat(state.foldedSteps, [previous])
				: state.foldedSteps

		return {
			...newState,
			foldedSteps: without([action.step], foldedSteps),
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

function currentExample(state = null, { type, situation, name }) {
	switch (type) {
		case 'SET_EXAMPLE':
			return name != null ? { name, situation } : null
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
		nextSteps: (state = []) => state,

		parsedRules: (state = null) => state,
		flatRules: (state = null) => state,
		analysis: (state = null) => state,

		targetNames: (state = null) => state,

		situationGate: (state = name => null) => state,

		done: (state = null) => state,

		iframe: (state = false) => state,

		themeColours,

		explainedVariable,

		currentExample
	}),
	// cross-cutting concerns because here `state` is the whole state tree
	reduceSteps(ReactPiwik, rules, formatInputs(rules, formValueSelector))
)
