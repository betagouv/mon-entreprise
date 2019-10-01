/* @flow */

import { findRuleByDottedName } from 'Engine/rules'
import {
	compose,
	defaultTo,
	dissoc,
	identity,
	lensPath,
	omit,
	over,
	set,
	uniq,
	without
} from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
import { targetNamesSelector } from 'Selectors/analyseSelectors'
import i18n from '../i18n'
import inFranceAppReducer from './inFranceAppReducer'
import storageReducer from './storageReducer'

import type { Action } from 'Types/ActionsTypes'

function explainedVariable(state = null, { type, variableName = null }) {
	switch (type) {
		case 'EXPLAIN_VARIABLE':
			return variableName
		case 'STEP_ACTION':
			return null
		default:
			return state
	}
}

function currentExample(state = null, { type, situation, name, dottedName }) {
	switch (type) {
		case 'SET_EXAMPLE':
			return name != null ? { name, situation, dottedName } : null
		default:
			return state
	}
}

function situationBranch(state = null, { type, id }) {
	switch (type) {
		case 'SET_SITUATION_BRANCH':
			return id
		default:
			return state
	}
}

function activeTargetInput(state = null, { type, name }) {
	switch (type) {
		case 'SET_ACTIVE_TARGET_INPUT':
			return name
		case 'RESET_SIMULATION':
			return null
		default:
			return state
	}
}

function lang(state = i18n.language, { type, lang }) {
	switch (type) {
		case 'SWITCH_LANG':
			return lang
		default:
			return state
	}
}

type ConversationSteps = {|
	+foldedSteps: Array<string>,
	+unfoldedStep: ?string
|}

function conversationSteps(
	state: ConversationSteps = {
		foldedSteps: [],
		unfoldedStep: null
	},
	action: Action
): ConversationSteps {
	if (action.type === 'RESET_SIMULATION')
		return { foldedSteps: [], unfoldedStep: null }

	if (action.type !== 'STEP_ACTION') return state
	const { name, step } = action
	if (name === 'fold')
		return {
			foldedSteps: [...state.foldedSteps, step],
			unfoldedStep: null
		}
	if (name === 'unfold') {
		return {
			foldedSteps: without([step], state.foldedSteps),
			unfoldedStep: step
		}
	}
	return state
}

function updateSituation(situation, { fieldName, value, config, rules }) {
	const goals = targetNamesSelector({ simulation: { config } }).filter(
		dottedName => {
			const target = rules.find(r => r.dottedName === dottedName)
			const isSmallTarget = !target.question || !target.formule
			return !isSmallTarget
		}
	)
	const removePreviousTarget = goals.includes(fieldName)
		? omit(goals)
		: identity
	return { ...removePreviousTarget(situation), [fieldName]: value }
}

function updatePeriod(situation, { toPeriod, rules }) {
	const currentPeriod = situation['période']
	if (currentPeriod === toPeriod) {
		return situation
	}
	if (!['mois', 'année'].includes(toPeriod)) {
		throw new Error('Oups, changement de période invalide')
	}

	const needConversion = Object.keys(situation).filter(dottedName => {
		const rule = findRuleByDottedName(rules, dottedName)
		return rule?.période === 'flexible'
	})

	const updatedSituation = Object.entries(situation)
		.filter(([fieldName]) => needConversion.includes(fieldName))
		.map(([fieldName, value]) => [
			fieldName,
			currentPeriod === 'mois' && toPeriod === 'année' ? value * 12 : value / 12
		])

	return {
		...situation,
		...Object.fromEntries(updatedSituation),
		période: toPeriod
	}
}

function simulation(state = null, action, rules) {
	if (action.type === 'SET_SIMULATION') {
		const { config, url } = action
		return { config, url, hiddenControls: [], situation: {} }
	}
	if (state === null) {
		return state
	}
	switch (action.type) {
		case 'HIDE_CONTROL':
			return { ...state, hiddenControls: [...state.hiddenControls, action.id] }
		case 'RESET_SIMULATION':
			return { ...state, hiddenControls: [], situation: {} }
		case 'UPDATE_SITUATION':
			return {
				...state,
				situation: updateSituation(state.situation, {
					fieldName: action.fieldName,
					value: action.value,
					config: state.config,
					rules
				})
			}
		case 'UPDATE_PERIOD':
			return {
				...state,
				situation: updatePeriod(state.situation, {
					toPeriod: action.toPeriod,
					rules
				})
			}
	}
	return state
}

const addAnswerToSituation = (dottedName, value, state) => {
	return compose(
		set(lensPath(['simulation', 'situation', dottedName]), value),
		over(lensPath(['conversationSteps', 'foldedSteps']), (steps = []) =>
			uniq([...steps, dottedName])
		)
	)(state)
}
const removeAnswerFromSituation = (dottedName, state) => {
	return compose(
		over(lensPath(['simulation', 'situation']), dissoc(dottedName)),
		over(lensPath(['conversationSteps', 'foldedSteps']), without([dottedName]))
	)(state)
}

const existingCompanyReducer = (state, action) => {
	if (!action.type.startsWith('EXISTING_COMPANY::')) {
		return state
	}
	if (action.type.endsWith('ADD_COMMUNE_DETAILS')) {
		return addAnswerToSituation(
			'établissement . localisation',
			JSON.stringify(action.details.localisation),
			state
		)
	}
	if (action.type.endsWith('RESET')) {
		removeAnswerFromSituation('établissement . localisation', state)
	}
	return state
}

export default reduceReducers(
	existingCompanyReducer,
	storageReducer,
	(state, action) =>
		combineReducers({
			sessionId: defaultTo(Math.floor(Math.random() * 1000000000000) + ''),
			conversationSteps,
			lang,
			rules: defaultTo(null),
			explainedVariable,
			// We need to access the `rules` in the simulation reducer
			simulation: (a, b) => simulation(a, b, state.rules),
			previousSimulation: defaultTo(null),
			currentExample,
			situationBranch,
			activeTargetInput,
			inFranceApp: inFranceAppReducer
		})(state, action)
)
