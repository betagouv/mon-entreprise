import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesEncoreApplicablesNomsSelector } from '@/store/selectors/questionsRéponduesEncoreApplicablesNoms.selector'

export const numéroDeLaQuestionEnCoursSelector = createSelector(
	[questionsRéponduesEncoreApplicablesNomsSelector, currentQuestionSelector],
	(questionsRépondues, questionEnCours) => {
		const index = questionsRépondues.findIndex(
			(question) => question === questionEnCours
		)

		return index < 0 ? questionsRépondues.length + 1 : index + 1
	}
)
