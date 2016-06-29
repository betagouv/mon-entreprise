export const SELECT_TAG = 'SELECT_TAG'

export function selectTag(tagName, tagValue) {
	return {type: SELECT_TAG, tagName, tagValue}
}
