
import { combineReducers } from 'redux'
import { SELECT_TAG, SELECT_VARIABLE} from './actions'

function selectedTags(state = [], {type, tagName, tagValue}) {
	switch (type) {
	case SELECT_TAG:
		return [...state, [tagName, tagValue]]
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



export default combineReducers({
	selectedTags,
	selectedVariable
})
