import { DottedName } from 'Rules'
import { situationSelector } from 'Selectors/simulationSelectors'
import Tracker from 'Tracker'

export default (tracker: Tracker) => {
	return ({ getState }: any) => (next: any) => (action: any) => {
		next(action)
		const newState = getState()
		if (action.type == 'STEP_ACTION' && action.name == 'fold') {
			tracker.debouncedPush([
				'trackEvent',
				'Simulator::answer',
				action.source,
				action.step,
				situationSelector(newState)[action.step as DottedName]
			])

			// TODO : add tracking in UI instead ?
			// if (!currentQuestionSelector(newState)) {
			// 	tracker.push([
			// 		'trackEvent',
			// 		'Simulator',
			// 		'simulation completed',
			// 		'after ' + newState.simulation.foldedSteps.length + ' questions'
			// 	])
			// }
		}

		if (action.type === 'SET_ACTIVE_TARGET_INPUT') {
			tracker.debouncedPush([
				'trackEvent',
				'Simulator',
				'target selected',
				newState.activeTargetInput
			])
		}

		if (
			action.type === 'UPDATE_SITUATION' ||
			action.type === 'UPDATE_TARGET_UNIT'
		) {
			tracker.debouncedPush([
				'trackEvent',
				'Simulator',
				'update situation',
				...(action.type === 'UPDATE_TARGET_UNIT'
					? ['unité', action.targetUnit]
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
			tracker.debouncedPush([
				'trackEvent',
				'Simulator',
				'change answer',
				action.step
			])
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
