import {
	currentQuestionSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import Tracker from 'Tracker'

export default (tracker: Tracker) => {
	return ({ getState }) => next => action => {
		next(action)
		const newState = getState()
		if (action.type == 'STEP_ACTION' && action.name == 'fold') {
			tracker.push([
				'trackEvent',
				'Simulator::answer',
				action.source,
				action.step,
				situationSelector(newState)[action.step]
			])

			if (!currentQuestionSelector(newState)) {
				tracker.push([
					'trackEvent',
					'Simulator',
					'simulation completed',
					'after ' +
						newState.conversationSteps.foldedSteps.length +
						' questions'
				])
			}
		}

		if (action.type === 'SET_ACTIVE_TARGET_INPUT') {
			tracker.push([
				'trackEvent',
				'Simulator',
				'target selected',
				newState.activeTargetInput
			])
		}

		if (
			action.type === 'UPDATE_SITUATION' ||
			action.type === 'UPDATE_DEFAULT_UNIT'
		) {
			tracker.push([
				'trackEvent',
				'Simulator',
				'update situation',
				...(action.type === 'UPDATE_DEFAULT_UNIT'
					? ['unité', action.defaultUnit]
					: [action.fieldName, action.value])
			])
		}
		if (action.type === 'START_CONVERSATION') {
			tracker.push([
				'trackEvent',
				'Simulator',
				'conversation started',
				JSON.stringify({
					target: newState.activeTargetInput,
					question: action.question
				})
			])
		}
		if (action.type == 'STEP_ACTION' && action.name == 'unfold') {
			tracker.push(['trackEvent', 'Simulator', 'change answer', action.step])
		}

		if (action.type === 'RESET_SIMULATION') {
			tracker.push(['trackEvent', 'Simulator', 'reset simulation'])
		}
		if (action.type === 'INITIALIZE_COMPANY_CREATION_CHECKLIST') {
			tracker.push([
				'trackEvent',
				'Creation',
				'status chosen',
				action.statusName
			])
		}
	}
}
