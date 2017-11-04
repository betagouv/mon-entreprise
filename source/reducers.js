import R from 'ramda'
import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'

import {rules, findRuleByName } from 'Engine/rules'
import {buildNextSteps, makeQuestion} from 'Engine/generateQuestions'
import computeThemeColours from 'Components/themeColours'
import { STEP_ACTION, START_CONVERSATION, EXPLAIN_VARIABLE, CHANGE_THEME_COLOUR} from './actions'

import {analyseTopDown} from 'Engine/traverse'

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

	let rootVariable = action.type == START_CONVERSATION ? action.rootVariable : state.analysedSituation.root.name

	let sim = findRuleByName(flatRules, rootVariable),
		// Hard assumptions cannot be changed, they are used to specialise a simulator
		// before the user sees the first question
		hardAssumptions = R.pathOr({},['simulateur','hypothèses'],sim),
		// Soft assumptions are revealed after the simulation ends, and can be changed
		softAssumptions = R.pathOr({},['simulateur','par défaut'],sim),
		intermediateSituation = assume(answerSource, hardAssumptions),
		completeSituation = assume(intermediateSituation,softAssumptions)

	let situationGate = completeSituation(state),
		analysedSituation = analyseTopDown(flatRules,rootVariable)(situationGate)

	let newState = {
		...state,
		analysedSituation,
		situationGate: situationGate,
		extraSteps: [],
		explainedVariable: null
	}

	if (action.type == START_CONVERSATION) {
		let next = buildNextSteps(situationGate, flatRules, newState.analysedSituation)

		return {
			...newState,
			foldedSteps: [],
			currentQuestion: R.head(next)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'fold') {
		tracker.push(['trackEvent', 'answer', action.step+": "+situationGate(action.step)]);

		let foldedSteps = [...state.foldedSteps, state.currentQuestion],
			next = buildNextSteps(situationGate, flatRules, newState.analysedSituation),
			assumptionsMade = !R.isEmpty(softAssumptions),
			done = next.length == 0

		// The simulation is "over" - except we can now fill in extra questions
		// where the answers were previously given default reasonable assumptions
		if (done && assumptionsMade) {
			let newSituation = intermediateSituation(state),
				reanalyse = analyseTopDown(flatRules,rootVariable)(newSituation),
				extraSteps = buildNextSteps(newSituation, flatRules, reanalyse)

			tracker.push(['trackEvent', 'done', 'extra questions: '+extraSteps.length]);

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

		let stepFinder = R.propEq('name', action.step),
			previous = state.currentQuestion,
			prevFinder = R.propEq('name', previous && previous.name),
			answered = previous && (answerSource(state)(previous.name) != undefined),
			foldable = answered ? [previous] : [],
			foldedSteps = R.reject(stepFinder)(R.concat(state.foldedSteps, foldable))

		return {
			...newState,
			foldedSteps,
			currentQuestion: makeQuestion(flatRules)(action.step)
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

		analysedSituation: (state = []) => state,

		situationGate: (state = name => null) => state,
		refine: (state = false) => state,

		themeColours,

		explainedVariable

	}),
	// cross-cutting concerns because here `state` is the whole state tree
	reduceSteps(ReactPiwik, rules, fromConversation)
)
