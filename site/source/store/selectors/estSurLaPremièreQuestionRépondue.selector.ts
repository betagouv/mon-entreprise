import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

export const estSurLaPremièreQuestionRépondueSelector = createSelector(
	[currentQuestionSelector, questionsRéponduesSelector],
	(questionEnCours, questionsRépondues) =>
		!!questionEnCours &&
		!!questionsRépondues &&
		!!questionsRépondues.length &&
		questionsRépondues[0] === questionEnCours
)
