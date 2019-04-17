/* @flow */

// $FlowFixMe
import { actionTypes } from 'redux-form'
import {
	currentQuestionSelector,
	formattedSituationSelector
} from 'Selectors/analyseSelectors'
import { debounce } from '../../../utils'

import type { Tracker } from 'Components/utils/withTracker'

export default (tracker: Tracker) => {
	const debouncedUserInputTracking = debounce(1000, action =>
		tracker.push([
			'trackEvent',
			'Simulator',
			'input',
			action.meta.field,
			action.payload
		])
	)

	// $FlowFixMe
	return ({ getState }) => next => action => {
		next(action)
		const newState = getState()
		if (action.type == 'STEP_ACTION' && action.name == 'fold') {
			tracker.push([
				'trackEvent',
				'Simulator::answer',
				action.source,
				action.step,
				formattedSituationSelector(newState)[action.step]
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

		if (action.type === actionTypes.CHANGE) {
			debouncedUserInputTracking(action)
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
