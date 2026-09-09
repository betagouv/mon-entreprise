import { createSelector } from 'reselect'

import { configSelector } from './config.selector'
import { questionsRéponduesNomSelector } from './questionsRéponduesNom.selector'
import { questionsSuivantesSelector } from './questionsSuivantes.selector'

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
