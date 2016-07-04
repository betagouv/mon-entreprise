
import { combineReducers } from 'redux'
import { SELECT_TAG } from './actions'

function selectedTags(state = [], {type, tagName, tagValue}) {
	switch (type) {
	case SELECT_TAG:
		return [...state, [tagName, tagValue]]
	default:
		return state
	}
}



export default combineReducers({
	selectedTags
})
