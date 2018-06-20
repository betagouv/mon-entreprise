/* @flow */

import { actionTypes } from 'redux-form'
import {
	currentQuestionSelector,
	formattedSituationSelector
} from 'Selectors/analyseSelectors'
import { debounce } from '../utils'
import type { State } from '../types/State'
import type { Tracker } from '../components/withTracker'

// Todo : type all actions
type Action = any

export default (tracker: Tracker) => {
	const debouncedUserInputTracking = debounce(1000, action =>
		tracker.push(['trackEvent', 'input', action.meta.field, action.payload])
	)

	return ({ getState }: Store<State>) => (next: Action => void) => (
		action: Action
	) => {
		next(action)
		const newState = getState()
		if (action.type == 'STEP_ACTION' && action.name == 'fold') {
			tracker.push([
				'trackEvent',
				'answer:' + action.source,
				action.step,
				formattedSituationSelector(newState)[action.step]
			])

			if (!currentQuestionSelector(newState)) {
				tracker.push([
					'trackEvent',
					'done',
					'after ' +
						newState.conversationSteps.foldedSteps.length +
						' questions'
				])
			}
		}
		if (action.type === 'SET_ACTIVE_TARGET_INPUT') {
			tracker.push(['trackEvent', 'select', newState.activeTargetInput])
		}

		if (action.type === 'START_CONVERSATION') {
			tracker.push([
				'trackEvent',
				'refine',
				newState.activeTargetInput,
				formattedSituationSelector(newState)[newState.activeTargetInput]
			])
		}
		if (action.type == 'STEP_ACTION' && action.name == 'unfold') {
			tracker.push(['trackEvent', 'unfold', action.step])
		}

		if (action.type === 'RESET_SIMULATION') {
			tracker.push(['trackEvent', 'restart', ''])
		}

		if (action.type === actionTypes.CHANGE) {
			debouncedUserInputTracking(action)
		}

		if (action.type === 'LOAD_PREVIOUS_SIMULATION') {
			tracker.push(['trackEvent', 'loadPreviousSimulation'])
		}

		if (action.type === 'DELETE_PREVIOUS_SIMULATION') {
			tracker.push(['trackEvent', 'deletePreviousSimulation'])
		}
	}
}
