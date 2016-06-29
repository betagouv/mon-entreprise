
import { combineReducers } from 'redux'
import { SELECT_TAG } from './actions'

function selectTag(state = {}, action) {
	switch (action.type) {
	case SELECT_TAG:
		return Object.assign({}, state, {
			[action.tagName]: action.tagValue
		})
	default:
		return state
	}
}


export default combineReducers({
	selectTag
})
