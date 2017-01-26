import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'
import {analyseSituation, variableType} from './engine/traverse'
import { euro } from './components/conversation/formValueTypes.js'

import Question from './components/conversation/Question'
import Input from './components/conversation/Input'
import RhetoricalQuestion from './components/conversation/RhetoricalQuestion'

import { STEP_ACTION, UNSUBMIT_ALL, START_CONVERSATION} from './actions'
import R from 'ramda'

import {findGroup, findRuleByDottedName, dottedName, parentName} from './engine/rules'
import {constructStepMeta} from './engine/conversation'

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

let situationGate = state =>
	name => formValueSelector('conversation')(state, name)

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
			console.log('action', action)
			// une étape vient d'être validée : on va changer son état
			let newSteps = R.pipe(
				R.map(step => step.name == name ? {...step, state: newState} : step),
				R.reject(R.whereEq({theEnd: true}))
			)(state.steps)

			window.situationGate = situationGate(state)

			// on calcule la prochaine étape, à ajouter sur la pile
			let
				analysedSituation = analyseSituation(
					situationGate(state)
				),

				missingVariables = R.pipe(
					R.map( ({name, derived: [missingVariables]}) =>
						(missingVariables || []).map(mv => [mv, name])
					),
					R.unnest,
					//groupBy but remove mv from value, it's now in the key
					R.reduce( (memo, [mv, dependencyOf]) => ({...memo, [mv]: [...(memo[mv] || []), dependencyOf] }), {})
				)(analysedSituation),
				missingVariablesList = R.keys(missingVariables),

				groups = R.groupBy(
					parentName
				)(missingVariablesList),

				// on va maintenant construire la liste des composants React correspondant aux questions pour obtenir les variables manquantes
				yyoo = R.pipe(
					R.mapObjIndexed((variables, group) =>
						R.pipe(
							findGroup,
							R.cond([
								// Pas de groupe trouvé : ce sont des variables individuelles
								[R.isNil, () => variables.map(dottedName => {
									let rule = findRuleByDottedName(dottedName)
									return Object.assign(constructStepMeta(rule),
										rule.contrainte == 'nombre positif' ?
										{
											component: Input,
											defaultValue: 0,
											valueType: euro,
											attributes: {
												inputMode: 'numeric',
												placeholder: 'votre réponse'
											}
										} : {
											component: Question,
											choices: [
												{value: 'non', label: 'Non'},
												{value: 'oui', label: 'Oui'}
											],
											defaultValue: 'Non',
										}
									)})],
								[R.T, group =>
									Object.assign(
										constructStepMeta(group),
										{
											component: Question,
											choices: group['choix exclusifs'].map(name => {
												let rule = findRuleByDottedName(
													group.dottedName + ' . ' + name
												)
												return {
													value: rule.name,
													label: rule && rule.titre || name
												}
											}),
											defaultValue: 'Non',
											helpText: 'Choisissez une réponse'
										}
									)]
							])
						)(group)
					),
					R.values,
					R.unnest
				)(groups)

			// la question doit pouvoir stocker tout ça dans la situation (redux-form) correctement


			return {...state, steps: yyoo, analysedSituation}




			// return {...state, steps: [...newSteps, stepData], analysedSituation}
			// ... do stuff
		} else {
			return state
		}

	}
)
