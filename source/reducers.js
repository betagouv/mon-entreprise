import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'
import { euro, months } from './components/conversation/formValueTypes.js'

import { EXPLAIN_VARIABLE, POINT_OUT_OBJECTIVES} from './actions'
import R from 'ramda'

import {findGroup, findRuleByDottedName, parentName, findVariantsAndRecords} from './engine/rules'

import {reduceSteps, generateGridQuestions, generateSimpleQuestions} from './engine/generateQuestions'

import computeThemeColours from './components/themeColours'

function themeColours(state = computeThemeColours(), {type, colour}) {
	if (type == 'CHANGE_THEME_COLOUR')
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
