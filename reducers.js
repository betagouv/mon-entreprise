
import { combineReducers } from 'redux'
import { SELECT_TAG, SELECT_VARIABLE, RESET_TAGS} from './actions'

function selectedTags(state = [], {type, tagName, tagValue}) {
	switch (type) {
	case SELECT_TAG:
		return [...state, [tagName, tagValue]]
	case RESET_TAGS:
		return []
	default:
		return state
	}
}

function selectedVariable(state = null, {type, name}) {
	switch (type) {
	case SELECT_VARIABLE:
		return name
	default:
		return state
	}
}

function rootVariables(state = ['cout du travail']) {
	return state
}



export default combineReducers({
	selectedTags,
	selectedVariable,
	rootVariables
})
