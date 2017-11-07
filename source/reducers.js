import R from 'ramda'
import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'

import {rules, findRuleByName } from 'Engine/rules'
import {nextSteps, makeQuestion} from 'Engine/generateQuestions'
import computeThemeColours from 'Components/themeColours'
import { STEP_ACTION, START_CONVERSATION, EXPLAIN_VARIABLE, CHANGE_THEME_COLOUR} from './actions'

import {analyse} from 'Engine/traverse'

import ReactPiwik from 'Components/Tracker';

// Our situationGate retrieves data from the "conversation" form
let fromConversation = state => name => formValueSelector('conversation')(state, name)

// assume "wraps" a given situation function with one that overrides its values with
// the given assumptions
let assume = (evaluator, assumptions) => state => name => {
			let userInput = evaluator(state)(name)
			return userInput != null ? userInput : assumptions[name]
		}

export let reduceSteps = (tracker, flatRules, answerSource) => (state, action) => {
	if (![START_CONVERSATION, STEP_ACTION].includes(action.type))
		return state

	let targetName = action.type == START_CONVERSATION ? action.targetName : state.targetName

	let sim = findRuleByName(flatRules, targetName),
		// Hard assumptions cannot be changed, they are used to specialise a simulator
		// before the user sees the first question
		hardAssumptions = R.pathOr({},['simulateur','hypothèses'],sim),
		// Soft assumptions are revealed after the simulation ends, and can be changed
		softAssumptions = R.pathOr({},['simulateur','par défaut'],sim),
		intermediateSituation = assume(answerSource, hardAssumptions),
		completeSituation = assume(intermediateSituation,softAssumptions)

	let situationGate = completeSituation(state),
		analysis = analyse(flatRules, targetName)(situationGate)

	let newState = {
		...state,
		targetName,
		analysis,
		situationGate: situationGate,
		extraSteps: [],
		explainedVariable: null
	}

	if (action.type == START_CONVERSATION) {
		let next = nextSteps(situationGate, flatRules, newState.analysis)

		return {
			...newState,
			foldedSteps: [],
			currentQuestion: R.head(next)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'fold') {
		tracker.push(['trackEvent', 'answer', action.step+": "+situationGate(action.step)]);

		let foldedSteps = [...state.foldedSteps, state.currentQuestion],
			next = nextSteps(situationGate, flatRules, newState.analysis),
			assumptionsMade = !R.isEmpty(softAssumptions),
			done = next.length == 0

		// The simulation is "over" - except we can now fill in extra questions
		// where the answers were previously given default reasonable assumptions
		if (done && assumptionsMade) {
			let newSituation = intermediateSituation(state),
				reanalysis = analyse(flatRules, targetName)(newSituation),
				extraSteps = nextSteps(newSituation, flatRules, reanalysis)

			tracker.push(['trackEvent', 'done', 'extra questions: '+extraSteps.length])

			return {
				...newState,
				foldedSteps,
				extraSteps,
				currentQuestion: null
			}
		}

		if (done) {
			tracker.push(['trackEvent', 'done', 'no more questions']);
		}

		return {
			...newState,
			foldedSteps,
			currentQuestion: R.head(next)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'unfold') {
		tracker.push(['trackEvent', 'unfold', action.step]);

		// We are possibly "refolding" a previously open question
		let previous = state.currentQuestion,
			// we fold it back into foldedSteps if it had been answered
			answered = previous && answerSource(state)(previous) != undefined,
			foldedSteps = answered ? R.concat(state.foldedSteps, [previous]) : state.foldedSteps,
			// we fold it back into "extra steps" if it came from there
			fromExtra = previous && softAssumptions[previous] != undefined,
			extraSteps = fromExtra ? R.concat(state.extraSteps, [previous]) : state.extraSteps

		return {
			...newState,
			foldedSteps: R.without([action.step], foldedSteps),
			extraSteps: R.without([action.step], extraSteps),
			currentQuestion: action.step
		}
	}
}

function themeColours(state = computeThemeColours(), {type, colour}) {
	if (type == CHANGE_THEME_COLOUR)
		return computeThemeColours(colour)
	else return state
}

function explainedVariable(state = null, {type, variableName=null}) {
	switch (type) {
	case EXPLAIN_VARIABLE:
		return variableName
	default:
		return state
	}
}


export default reduceReducers(
	combineReducers({
		sessionId: (id =  Math.floor(Math.random() * 1000000000000) + '') => id,
		//  this is handled by redux-form, pas touche !
		form: formReducer,

		/* Have forms been filled or ignored ?
		false means the user is reconsidering its previous input */
		foldedSteps: (steps = []) => steps,
		extraSteps: (steps = []) => steps,
		currentQuestion: (state = null) => state,

		analysis: (state = null) => state,

		targetName: (state = null) => state,

		situationGate: (state = name => null) => state,
		refine: (state = false) => state,

		themeColours,

		explainedVariable

	}),
	// cross-cutting concerns because here `state` is the whole state tree
	reduceSteps(ReactPiwik, rules, fromConversation)
)
