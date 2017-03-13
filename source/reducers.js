import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'
import {analyseSituation, variableType} from './engine/traverse'
import { euro, months } from './components/conversation/formValueTypes.js'

import Question from './components/conversation/Question'
import Input from './components/conversation/Input'
import RhetoricalQuestion from './components/conversation/RhetoricalQuestion'

import { STEP_ACTION, UNSUBMIT_ALL, START_CONVERSATION, EXPLAIN_VARIABLE} from './actions'
import R from 'ramda'

import {findGroup, findRuleByDottedName, dottedName, parentName, collectMissingVariables} from './engine/rules'
import {constructStepMeta} from './engine/conversation'

import computeThemeColours from './components/themeColours'

function themeColours(state = computeThemeColours(), {type, colour}) {
	if (type == 'CHANGE_THEME_COLOUR')
		return computeThemeColours(colour)
	else return state
}

let situationGate = state =>
	name => formValueSelector('conversation')(state, name)

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
		//  this is handled by redux-form, pas touche !
		form: formReducer,

		/* Have forms been filled or ignored ?
		false means the user is reconsidering its previous input */
		steps: (steps=[]) => steps,

		submittedSteps: (steps=[]) => steps,

		analysedSituation: (state = []) => state,

		themeColours,

		explainedVariable
	}),
	// cross-cutting concerns because here `state` is the whole state tree
	(state, action) => {
		if (action.type == STEP_ACTION || action.type == START_CONVERSATION) {

			// pour débugguer :
			window.situationGate = situationGate(state)

			let newlySubmittedSteps =
				action.newState == 'filled'
				? [{
					...state.steps.find(s => s.name === action.name),
					state: 'filled'
				}]
				: []


			// on calcule la prochaine étape, à ajouter sur la pile
			let
				// une liste des objectifs de la simulation (des 'rules' aussi nommées 'variables')
				analysedSituation = analyseSituation(
					situationGate(state)
				),

				// y = console.log('analysedSituation', JSON.stringify(analysedSituation)),

				// on collecte les variables manquantes : celles qui sont nécessaires pour
				// remplir les objectifs de la simulation (calculer des cotisations) mais qui n'ont pas
				// encore été renseignées
				missingVariables = collectMissingVariables('groupByMissingVariable', analysedSituation),

				missingVariablesList = R.keys(missingVariables),

				/*
					Certaines variables manquantes peuvent être factorisées dans des groupes.
					Par exemple, au lieu de :

					q1: "Pensez vous porlonger le CDD en CDI",
					r1: Oui | Non
					q2: "Pensez-vous qu'une rupture pour faute grave est susceptible d'arriver"
					r2: Oui | Non

					on préfère :

					q: "Pensez-vous être confronté à l'un de ces événements ?"
					r: Prolongation du CDD en CDI | Rupture pour faute grave
				*/
				groups = R.groupBy(
					parentName
				)(missingVariablesList),

				// on va maintenant construire la liste des composants React qui afficheront les questions à l'utilisateur pour que l'on obtienne les variables manquantes
				steps = R.pipe(
					R.mapObjIndexed((variables, group) =>
						R.pipe(
							findGroup,
							R.cond([
								// Pas de groupe trouvé : ce sont des variables individuelles
								[R.isNil, () => variables.map(dottedName => {
									let rule = findRuleByDottedName(dottedName)
									return Object.assign(constructStepMeta(rule),
										rule.format == 'nombre positif' ||
										rule.format == 'période' ?
										{
											component: Input,
											valueType: rule.format == 'nombre positif' ? euro : months,
											attributes: {
												inputMode: 'numeric',
												placeholder: 'votre réponse'
											},
											suggestions: rule.suggestions
										} : {
											component: Question,
											choices: [
												{value: 'non', label: 'Non'},
												{value: 'oui', label: 'Oui'}
											]
										}
									)})],
								[R.T, group =>
									Object.assign(
										constructStepMeta(group),
										{
											component: Question,
											choices:
												group['une possibilité'].concat(
													group['langue au chat possible'] === 'oui' ?
														[{value: '_', label: 'Aucun'}] : []
												)
										}
									)]
							])
						)(group)
					),
					R.values,
					R.unnest
				)(groups)

			console.log('submittedSteps', newlySubmittedSteps)
			return {
				...state,
				steps,
				submittedSteps: state.submittedSteps.concat(newlySubmittedSteps),
				analysedSituation
			}

		} else {
			return state
		}

	}
)
