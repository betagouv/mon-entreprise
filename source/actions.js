/* @flow */
import type { ResetSimulationAction } from './types/Actions'

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
export function setExample(name, situation) {
	return { type: 'SET_EXAMPLE', situation, name }
}

export const START_CONVERSATION = 'START_CONVERSATION'

export const CHANGE_THEME_COLOUR = 'CHANGE_THEME_COLOUR'

// $FlowFixMe
export function changeThemeColour(colour) {
	return { type: CHANGE_THEME_COLOUR, colour }
}

export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'
export const CHANGE_LANG = 'CHANGE_LANG'
