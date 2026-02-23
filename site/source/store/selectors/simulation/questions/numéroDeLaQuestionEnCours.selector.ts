import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/simulation/questions/currentQuestion.selector'
import { questionsRéponduesEncoreApplicablesNomsSelector } from '@/store/selectors/simulation/questions/questionsRéponduesEncoreApplicablesNoms.selector'

export const numéroDeLaQuestionEnCoursSelector = createSelector(
	[questionsRéponduesEncoreApplicablesNomsSelector, currentQuestionSelector],
	(questionsRépondues, questionEnCours) => {
		const index = questionsRépondues.findIndex(
			(question) => question === questionEnCours
		)

		return index < 0 ? questionsRépondues.length + 1 : index + 1
	}
)
