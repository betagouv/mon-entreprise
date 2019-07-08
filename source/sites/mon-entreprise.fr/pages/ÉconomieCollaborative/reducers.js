import { map, mergeAll, pipe, unnest, without } from 'ramda'
import activités from './activités.yaml'
export let flatActivités = pipe(
	map(a => (a.activités ? [a, ...a.activités] : [a])),
	unnest
)(activités)

export let getActivité = a => flatActivités.find(item => item.titre === a)
let initialState = {
	selectedActivities: [],
	activityAnswers: pipe(
		map(a => ({
			[a.titre]: a.exonérations
				? { exonérations: a.exonérations.map(() => null) }
				: {}
		})),
		mergeAll
	)(flatActivités)
}

let reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SELECT_ACTIVITY':
			// eslint-disable-next-line
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
