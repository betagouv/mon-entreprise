import { without } from 'ramda'
let initialState = {
	selectedActivities: []
}

let reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SELECT_ACTIVITY':
			let titre = action.titre,
				selectedActivities = state.selectedActivities,
				selected = selectedActivities.includes(titre)
			return {
				...state,
				selectedActivities: selected
					? without([titre], selectedActivities)
					: [...selectedActivities, titre]
			}
		default:
			throw new Error('Unexpected action')
	}
}
export { initialState, reducer }
