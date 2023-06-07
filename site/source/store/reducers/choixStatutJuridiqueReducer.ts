import { combineReducers } from 'redux'

import { Action } from '@/store/actions/actions'

function hiringChecklist(
	state: { [key: string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_HIRING_ITEM':
			return {
				...state,
				[action.name]: action.checked,
			}
		case 'INITIALIZE_HIRING_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		default:
			return state
	}
}

const choixStatutJuridiqueReducer = combineReducers({
	hiringChecklist,
})

export default choixStatutJuridiqueReducer

export type ChoixStatutJuridiqueState = ReturnType<
	typeof choixStatutJuridiqueReducer
>
