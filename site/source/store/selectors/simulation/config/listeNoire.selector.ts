import { createSelector } from 'reselect'

import { QuestionsAutoGénérées } from '@/domaine/SimulationConfig'
import { configSelector } from '@/store/selectors/simulation/config/config.selector'

export const listeNoireSelector = createSelector([configSelector], (config) => {
	const listeNoire =
		(config.questions as QuestionsAutoGénérées)?.['liste noire'] ?? []

	return [...listeNoire, 'date']
})
