import R from 'ramda'
import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'

import {rules} from 'Engine/rules'
import {buildNextSteps, generateGridQuestions, generateSimpleQuestions} from 'Engine/generateQuestions'
import computeThemeColours from 'Components/themeColours'
import { STEP_ACTION, START_CONVERSATION, EXPLAIN_VARIABLE, POINT_OUT_OBJECTIVES, CHANGE_THEME_COLOUR} from './actions'

import {analyseSituation} from 'Engine/traverse'

let situationGate = state =>
	name => formValueSelector('conversation')(state, name)

let analyse = rootVariable => R.pipe(
	situationGate,
	// une liste des objectifs de la simulation (des 'rules' aussi nommées 'variables')
	analyseSituation(rules, rootVariable)
)

export let reduceSteps = (state, action) => {

	if (![START_CONVERSATION, STEP_ACTION].includes(action.type))
		return state

	let rootVariable = action.type == START_CONVERSATION ? action.rootVariable : state.analysedSituation.name

	let returnObject = {
		...state,
		analysedSituation: analyse(rootVariable)(state)
	}

	if (action.type == START_CONVERSATION) {
		return {
			...returnObject,
			foldedSteps: state.foldedSteps || [],
			unfoldedSteps: buildNextSteps(rules, returnObject.analysedSituation)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'fold') {
		return {
			...returnObject,
			foldedSteps: [...state.foldedSteps, R.head(state.unfoldedSteps)],
			unfoldedSteps: buildNextSteps(rules, returnObject.analysedSituation)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'unfold') {
		let stepFinder = R.propEq('name', action.step),
			foldedSteps = R.reject(stepFinder)(state.foldedSteps)
		if (foldedSteps.length != state.foldedSteps.length - 1)
			throw 'Problème lors du dépliement d\'une réponse'

		return {
			...returnObject,
			foldedSteps,
			unfoldedSteps: [R.find(stepFinder)(state.foldedSteps)]
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

function pointedOutObjectives(state=[], {type, objectives}) {
	switch (type) {
	case POINT_OUT_OBJECTIVES:
		return objectives
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
		unfoldedSteps: (steps = []) => steps,

		analysedSituation: (state = []) => state,

		themeColours,

		explainedVariable,

		pointedOutObjectives,
	}),
	// cross-cutting concerns because here `state` is the whole state tree
	reduceSteps
)
