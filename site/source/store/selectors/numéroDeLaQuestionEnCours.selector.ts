import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

export const numéroDeLaQuestionEnCoursSelector = createSelector(
	[questionsRéponduesSelector, currentQuestionSelector],
	(questionsRépondues, questionEnCours) => {
		const index = questionsRépondues.findIndex(
			(question) => question === questionEnCours
		)

		return index < 0 ? questionsRépondues.length + 1 : index + 1
	}
)
