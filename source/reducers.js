import React from 'react'
import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import {reducer as formReducer, formValueSelector} from 'redux-form'
import {analyseSituation} from './engine/traverse'
import { euro, months } from './components/conversation/formValueTypes.js'

import { STEP_ACTION, START_CONVERSATION, EXPLAIN_VARIABLE, POINT_OUT_OBJECTIVES} from './actions'
import R from 'ramda'

import {findGroup, findRuleByDottedName, parentName, collectMissingVariables, findVariantsAndRecords} from './engine/rules'

import {generateGridQuestions, generateSimpleQuestions} from './engine/generateQuestions'

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

function pointedOutObjectives(state=[], {type, objectives}) {
	switch (type) {
	case POINT_OUT_OBJECTIVES:
		return objectives
	default:
		return state
	}
}

let handleSteps = (state, action) => {

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
			unfoldedSteps: buildNextSteps(returnObject.analysedSituation)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'fold') {
		return {
			...returnObject,
			foldedSteps: [...state.foldedSteps, R.head(state.unfoldedSteps)],
			unfoldedSteps: buildNextSteps(returnObject.analysedSituation)
		}
	}
	if (action.type == STEP_ACTION && action.name == 'unfold') {
		let stepFinder = R.propEq('name', action.step),
			foldedSteps = R.pipe(
					R.splitWhen(stepFinder),
					R.head
			)(state.foldedSteps)
		return {
			...returnObject,
			foldedSteps,
			unfoldedSteps: [R.find(stepFinder)(state.foldedSteps)]
		}
	}
}

let analyse = rootVariable => R.pipe(
	situationGate,
	// une liste des objectifs de la simulation (des 'rules' aussi nommées 'variables')
	analyseSituation(rootVariable)
)

let missingVariables

/*
	COLLECTE DES VARIABLES MANQUANTES
	*********************************
	on collecte les variables manquantes : celles qui sont nécessaires pour
	remplir les objectifs de la simulation (calculer des cotisations) mais qui n'ont pas
	encore été renseignées

	TODO perf : peut-on le faire en même temps que l'on traverse l'AST ?
	Oui sûrement, cette liste se complète en remontant l'arbre. En fait, on le fait déjà pour nodeValue,
	et quand nodeValue vaut null, c'est qu'il y a des missingVariables ! Il suffit donc de remplacer les
	null par un tableau, et d'ailleurs utiliser des fonction d'aide pour mutualiser ces tests.

	missingVariables: {variable: [objectives]}
 */
let buildNextSteps = analysedSituation => {
	let missingVariables = collectMissingVariables('groupByMissingVariable')(
		R.path(['formule', 'explanation', 'explanation'])(analysedSituation)
	)

	/*
		Parmi les variables manquantes, certaines sont citées dans une règle de type 'une possibilité'.
		**On appelle ça des groupes de type 'variante'.**
		Il est alors plus intéressant de demander leur valeur dans un grille de possibilité plutôt que de façon indépendante.

		Par exemple, au lieu de :

		q1: "Pensez vous prolonger le CDD en CDI",
		r1: Oui | Non
		q2: "Pensez-vous qu'une rupture pour faute grave est susceptible d'arriver"
		r2: Oui | Non

		on préfère :

		q: "Pensez-vous être confronté à l'un de ces événements ?"
		r: Prolongation du CDD en CDI | Rupture pour faute grave.

		Ceci est possible car ce sont tous les deux des événements et qu'ils sont incompatibles entre eux.
		Pour l'instant, cela n'est possible que si les variables ont comme parent (ou grand-parent),
		au sens de leur espace de nom, une règle de type 'une possibilité'.
		#TODO pouvoir faire des variantes sans cette contrainte d'espace de nom

		D'autres variables pourront être regroupées aussi, car elles partagent un parent, mais sans fusionner leurs questions dans l'interface. Ce sont des **groupes de type _record_ **
	*/
	return R.pipe(
		R.keys,
		R.reduce(
			findVariantsAndRecords
			, {variantGroups: {}, recordGroups: {}}
		),
		// on va maintenant construire la liste des composants React qui afficheront les questions à l'utilisateur pour que l'on obtienne les variables manquantes
		R.evolve({
			variantGroups: generateGridQuestions(missingVariables),
			recordGroups: generateSimpleQuestions(missingVariables),
		}),
		R.values,
		R.unnest,
	)(missingVariables)
}

export default reduceReducers(
	combineReducers({
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
	handleSteps
)
