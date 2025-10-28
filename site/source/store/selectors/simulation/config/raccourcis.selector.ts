import { createSelector } from 'reselect'

import { configSelector } from '@/store/selectors/simulation/config/config.selector'
import { questionsRéponduesNomSelector } from '@/store/selectors/simulation/questions/questionsRéponduesNom.selector'
import { questionsSuivantesSelector } from '@/store/selectors/simulation/questions/questionsSuivantes.selector'

export const raccourcisSelector = createSelector(
	[configSelector, questionsSuivantesSelector, questionsRéponduesNomSelector],
	(config, questionsSuivantes, questionsRépondues) => {
		const raccourcis = config.questions?.raccourcis ?? []

		return raccourcis.filter(
			({ dottedName }) =>
				questionsSuivantes.includes(dottedName) &&
				!questionsRépondues.includes(dottedName)
		)
	}
)
