export let SELECT_TAG = 'SELECT_TAG'

export function selectTag(tagName, tagValue) {
	return {type: SELECT_TAG, tagName, tagValue}
}

export let SELECT_VARIABLE = 'SELECT_VARIABLE'

export function selectVariable(name) {
	return {type: SELECT_VARIABLE, name}
}
