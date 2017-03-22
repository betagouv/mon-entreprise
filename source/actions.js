// The input "conversation" is composed of "steps"
// The state keeps track of which of them have been submitted
// The user can also come back to one of his answers and edit it
export const STEP_ACTION = 'STEP_ACTION'
export function stepAction(name, step) {
	return {type: STEP_ACTION, name, step}
}

export const START_CONVERSATION = 'START_CONVERSATION'

// Reset the form
export const UNSUBMIT_ALL = 'UNSUBMIT_ALL'


// Collect the input information from the forms, send them to the simulation engine API
// then update the results in the UI
export const SIMULATION_UPDATE_REQUEST = 'SIMULATION_UPDATE_REQUEST'
export const SIMULATION_UPDATE_SUCCESS = 'SIMULATION_UPDATE_SUCCESS'
export const SIMULATION_UPDATE_FAILURE = 'SIMULATION_UPDATE_FAIL'

// Modify the UI parts displayed to the user
export const TOGGLE_TOP_SECTION = 'TOGGLE_TOP_SECTION'
export const TOGGLE_ADVANCED_SECTION = 'TOGGLE_ADVANCED_SECTION'

// The initial request triggers the display of results based on default input information (not filled by the user)
export const INITIAL_REQUEST = 'INITIAL_REQUEST'

export const CHANGE_THEME_COLOUR = 'CHANGE_THEME_COLOUR'
export function changeThemeColour(colour) {return {type: CHANGE_THEME_COLOUR, colour}}


export const EXPLAIN_VARIABLE = 'EXPLAIN_VARIABLE'

export const POINT_OUT_OBJECTIVES = 'POINT_OUT_OBJECTIVES'
