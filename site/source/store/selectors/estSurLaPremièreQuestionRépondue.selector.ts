import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { answeredQuestionsSelector } from '@/store/selectors/simulationSelectors'

export const estSurLaPremièreQuestionRépondueSelector = createSelector(
	[currentQuestionSelector, answeredQuestionsSelector],
	(questionEnCours, questionsRépondues) =>
		!!questionEnCours &&
		!!questionsRépondues &&
		!!questionsRépondues.length &&
		questionsRépondues[0] === questionEnCours
)
