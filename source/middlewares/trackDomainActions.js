import {
	formattedSituationSelector,
	currentQuestionSelector
} from 'Selectors/analyseSelectors'

export default tracker => ({ getState }) => next => action => {
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
				'after ' + newState.foldedSteps.length + ' questions'
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
	if (action.type === 'USER_INPUT_UPDATE') {
		tracker.push(['trackEvent', 'input', action.meta.field, action.payload])
	}
	if (action.type === 'LOAD_PREVIOUS_SIMULATION') {
		tracker.push(['trackEvent', 'loadPreviousSimulation'])
	}
}
