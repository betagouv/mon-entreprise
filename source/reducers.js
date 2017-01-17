import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'
import {analyseSituation, variableType} from './traverse'
import { euro } from './components/conversation/formValueTypes.js'

import Question from './components/conversation/Question'
import Input from './components/conversation/Input'
import RhetoricalQuestion from './components/conversation/RhetoricalQuestion'

import { STEP_ACTION, UNSUBMIT_ALL, START_CONVERSATION} from './actions'
import R from 'ramda'

import computeThemeColours from './components/themeColours'

function steps(steps = [], {type}) {
	switch (type) {
	case UNSUBMIT_ALL:
		return []
	default:
		return steps
	}
}

function themeColours(state = computeThemeColours(), {type, colour}) {
	if (type == 'CHANGE_THEME_COLOUR')
		return computeThemeColours(colour)
	else return state
}

export default reduceReducers(
	combineReducers({
		//  this is handled by redux-form, pas touche !
		form: formReducer,

		/* Have forms been filled or ignored ?
		false means the user is reconsidering its previous input */
		steps,

		analysedSituation: (state = []) => state,

		themeColours
	}),
	// cross-cutting concerns because here `state` is the whole state tree
	(state, action) => {
		if (action.type == STEP_ACTION || action.type == START_CONVERSATION) {
			let {newState, name} = action

			// une étape vient d'être validée : on va changer son état
			let newSteps = R.pipe(
				R.map(step => step.name == name ? {...step, state: newState} : step),
				R.reject(R.whereEq({theEnd: true}))
			)(state.steps)

			// on calcule la prochaine étape, à ajouter sur la pile
			let analysedSituation = analyseSituation(name => formValueSelector('conversation')(state, name)),
				yo = console.log('analysedSituation', analysedSituation),
				missingVariables = R.pipe(
					R.map(({derived: [missingVariables]}) => missingVariables || []),
					R.flatten
				)(analysedSituation),
				yo2 = console.log('miss', missingVariables),

				[firstMissingVariable] = missingVariables,

				type = variableType(firstMissingVariable),

				stepData = Object.assign({
					name: firstMissingVariable,
					state: null,
					dependecyOfVariable: null, //TODO
					title: firstMissingVariable,
					question: firstMissingVariable,
					visible: true,
					helpText: <p>
						The impossible is possible, at Zombo.com
						<br/>
						<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F33777" target="_blank">
							Comprendre comment tout ce bordel se ficelle
						</a>
					</p>
				}, type == 'boolean' ? {
					component: Question,
					choices: ['non', 'oui'],
					defaultValue: 'Non'
				}: type == 'numeric' ? {
					component: Input,
					defaultValue: 0,
					valueType: euro,
					attributes: {
						/* We use 'text' inputs : browser behaviour with input=number
						doesn't quite work with our "update simulation on input change"... */
						inputMode: 'numeric',
						placeholder: 'votre réponse'
					}
				} : firstMissingVariable == undefined ? {
					theEnd: true,
					component: RhetoricalQuestion,
					question: <span>
						{'Merci. N\'hésitez pas à partager le simulateur !'}
					</span>,
					helpText: null
				}: {})


			return {...state, steps: [...newSteps, stepData], analysedSituation}
			// ... do stuff
		} else {
			return state
		}

	}
)
