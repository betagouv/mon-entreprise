import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export const listeNoireSelector = createSelector([configSelector], (config) => {
	const listeNoire = config.questions?.['liste noire'] ?? []

	return [...listeNoire, 'date']
})
