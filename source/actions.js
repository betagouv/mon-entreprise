/* @flow */
import type {
	ResetSimulationAction,
	LoadPreviousSimulationAction
} from './types/Actions'

// The input "conversation" is composed of "steps"
// The state keeps track of which of them have been submitted
// The user can also come back to one of his answers and edit it
export const STEP_ACTION = 'STEP_ACTION'

// $FlowFixMe
export function stepAction(name, step, source) {
	return { type: STEP_ACTION, name, step, source }
}

export function resetSimulation(): ResetSimulationAction {
	return {
		type: 'RESET_SIMULATION'
	}
}

// $FlowFixMe
export function setExample(name, situation, dottedName) {
	return { type: 'SET_EXAMPLE', name, situation, dottedName }
}

export const START_CONVERSATION = 'START_CONVERSATION'

export const CHANGE_THEME_COLOUR = 'CHANGE_THEME_COLOUR'

export function loadPreviousSimulation(): LoadPreviousSimulationAction {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION'
	}
}
// $FlowFixMe
export function changeThemeColour(colour) {
	return { type: CHANGE_THEME_COLOUR, colour }
}

export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'
