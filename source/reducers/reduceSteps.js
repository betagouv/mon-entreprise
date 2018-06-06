import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'
import { collectDefaults, rules, rulesFr } from 'Engine/rules'
import { analyseMany, parseAll } from 'Engine/traverse'
import { concat, head, map, path, without } from 'ramda'

export default (flatRules, answerSource) => (state, action) => {
	state.flatRules = flatRules

	if (
		![
			'STEP_ACTION',
			'USER_INPUT_UPDATE',
			'START_CONVERSATION',
			'SET_ACTIVE_TARGET_INPUT',
			'LOAD_PREVIOUS_SIMULATION'
		].includes(action.type)
	)
		return state

	if (path(['form', 'conversation', 'syncErrors'], state)) return state

	if (action.type == 'STEP_ACTION' && action.name == 'fold') {
		let foldedSteps = [...state.foldedSteps, state.currentQuestion]

		return {
			...newState,
			foldedSteps
		}
	}
	if (action.type == 'STEP_ACTION' && action.name == 'unfold') {
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
			currentQuestion: action.step
		}
	}
}
