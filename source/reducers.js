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
import {borrify} from './engine/remove-diacritics'

import {findGroup, findRuleByDottedName, dottedName} from './engine/rules'
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
				missingVariables = R.pipe(
					R.map( ({name, derived: [missingVariables]}) =>
						(missingVariables || []).map(mv => [mv, name])
					),
					R.unnest,
					//groupBy but remove mv from value, it's now in the key
					R.reduce( (memo, [mv, dependencyOf]) => ({...memo, [mv]: [...(memo[mv] || []), dependencyOf] }), {})
				)(analysedSituation),
				missingVariablesList = R.keys(missingVariables),

				yà = console.log('missingVariablesList', missingVariablesList),

			// identification des groupes de variables manquantes
				// groups = [...missingVariablesList.reduce(
				// 	(set, variable) => {
				// 		let subs = R.pipe(
				// 			borrify,
				// 			R.split(' . '),
				// 			R.dropLast(1),
				// 			R.join(' . ')
				// 		)(variable)
				//
				// 		if (subs.length)
				// 			set.add(subs)
				//
				// 		return set
				// 	}
				// , new Set())],
				groups = R.groupBy(
					R.pipe(
						borrify,
						R.split(' . '),
						R.dropLast(1),
						R.join(' . ')
					)
				)(missingVariablesList),

				yo = console.log('groups', groups),

				// on va maintenant construire la liste des composants React correspondant aux questions pour obtenir les variables manquantes
				yyoo = R.pipe(
					R.mapObjIndexed((variables, group) =>
						R.pipe(
							findGroup,
							R.cond([
								// Pas de groupe trouvé : ce sont des variables individuelles
								[R.isNil, () => variables.map(dottedName => {
									console.log('dottedName', dottedName)
									let rule = findRuleByDottedName(dottedName)
									console.log('rule', rule)
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
											choices: ['Non', 'Oui'],
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
												return rule && rule.titre || name
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
				)(groups),

				l = console.log('yyoo', yyoo)

			// la question doit pouvoir stocker tout ça dans la situation (redux-form) correctement


			return {...state, steps: yyoo, analysedSituation}



			let [firstMissingVariable, dependencyOfVariables] = R.isEmpty(missingVariables) ? [] : R.toPairs(missingVariables)[0],

				type = variableType(firstMissingVariable),

				stepData = Object.assign({
					name: firstMissingVariable,
					state: null,
					dependencyOfVariables: dependencyOfVariables,
					title: firstMissingVariable,
					question: firstMissingVariable,
					visible: true,
					helpText: <p>
						Le contrat à durée indéterminée est une exception au CDI.
						<br/>
						<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F33777" target="_blank">
							En savoir plus (service-public.fr)
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
