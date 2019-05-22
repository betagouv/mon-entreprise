import { without, map, pipe, mergeAll } from 'ramda'
import data from './activités.yaml'

let initialState = {
	selectedActivities: [],
	activityAnswers: pipe(
		map(a => ({
			[a.titre]: a.exonérations
				? { exonérations: a.exonérations.map(() => null) }
				: {}
		})),
		mergeAll
	)(data)
}
console.log(initialState)

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
		case 'UPDATE_ACTIVITY':
			return {
				...state,
				activityAnswers: {
					...state.activityAnswers,
					[action.title]: action.data
				}
			}
		default:
			throw new Error('Unexpected action')
	}
}
export { initialState, reducer }
