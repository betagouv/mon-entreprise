import { path, head, reject, concat, without, length } from 'ramda'

import { rules, collectDefaults, rulesFr } from 'Engine/rules'
import {
	getNextSteps,
	collectMissingVariablesByTarget
} from 'Engine/generateQuestions'
import { analyseMany, parseAll } from 'Engine/traverse'

export default (tracker, flatRules, answerSource) => (state, action) => {
	state.flatRules = flatRules
	// Optimization - don't parse on each analysis
	if (!state.parsedRules) {
		state.parsedRules = parseAll(flatRules)
	}

	// TODO
	if (action.type == 'CHANGE_LANG') {
		if (action.lang == 'fr') {
			flatRules = rulesFr
		} else flatRules = rules
		return {
			...state,
			flatRules
		}
	}

	if (
		![
			'SET_CONVERSATION_TARGETS',
			'STEP_ACTION',
			'USER_INPUT_UPDATE',
			'START_CONVERSATION',
			'SET_ACTIVE_TARGET_INPUT'
		].includes(action.type)
	)
		return state

	if (
		path(['form', 'conversation', 'syncErrors'], state) ||
		(state.activeTargetInput && !answerSource(state)(state.activeTargetInput))
	)
		return state

	let targetNames = reject(
		name => state.activeTargetInput && state.activeTargetInput.includes(name)
	)(state.targetNames)

	// Most rules have default values
	let rulesDefaults = collectDefaults(flatRules),
		situationWithDefaults = assume(answerSource, rulesDefaults)

	let analysis = analyseMany(state.parsedRules, targetNames)(
		situationWithDefaults(state)
	)

	if (action.type === 'USER_INPUT_UPDATE') {
		return { ...state, analysis, situationGate: situationWithDefaults(state) }
	}

	let nextStepsAnalysis = analyseMany(state.parsedRules, targetNames)(
			answerSource(state)
		),
		missingVariablesByTarget = collectMissingVariablesByTarget(
			nextStepsAnalysis.targets
		),
		nextSteps = getNextSteps(missingVariablesByTarget),
		currentQuestion = head(nextSteps)

	let newState = {
		...state,
		analysis,
		situationGate: situationWithDefaults(state),
		explainedVariable: null,
		nextSteps,
		currentQuestion,
		foldedSteps:
			action.type === 'SET_CONVERSATION_TARGETS' && action.reset
				? []
				: state.foldedSteps
	}

	if (['START_CONVERSATION', 'SET_ACTIVE_TARGET_INPUT'].includes(action.type))
		return {
			...newState,
			missingVariablesByTarget: {
				initial: missingVariablesByTarget,
				current: missingVariablesByTarget
			}
		}

	if (action.type == 'STEP_ACTION' && action.name == 'fold') {
		tracker.push([
			'trackEvent',
			'answer:' + action.source,
			action.step + ': ' + situationWithDefaults(state)(action.step)
		])

		if (!newState.currentQuestion) {
			tracker.push([
				'trackEvent',
				'done',
				'after' + length(newState.foldedSteps) + 'questions'
			])
		}
		let foldedSteps = [...state.foldedSteps, state.currentQuestion]

		return {
			...newState,
			foldedSteps,
			missingVariablesByTarget: {
				...state.missingVariablesByTarget,
				current: missingVariablesByTarget
			}
		}
	}
	if (action.type == 'STEP_ACTION' && action.name == 'unfold') {
		tracker.push(['trackEvent', 'unfold', action.step])

		// We are possibly "refolding" a previously open question
		let previous = state.currentQuestion,
			// we fold it back into foldedSteps if it had been answered
			answered = previous && answerSource(state)(previous) != undefined,
			rawFoldedSteps = answered
				? concat(state.foldedSteps, [previous])
				: state.foldedSteps,
			foldedSteps = without([action.step], rawFoldedSteps)

		return {
			...newState,
			foldedSteps,
			currentQuestion: action.step,
			missingVariablesByTarget: {
				...state.missingVariablesByTarget,
				current: missingVariablesByTarget
			}
		}
	}
}

// assume "wraps" a given situation function with one that overrides its values with
// the given assumptions
export let assume = (evaluator, assumptions) => state => name => {
	let userInput = evaluator(state)(name)
	return userInput != null ? userInput : assumptions[name]
}
