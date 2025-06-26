import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesEncoreApplicablesNomsSelector } from '@/store/selectors/questionsRéponduesEncoreApplicablesNoms.selector'

export const estSurLaPremièreQuestionRépondueSelector = createSelector(
	[currentQuestionSelector, questionsRéponduesEncoreApplicablesNomsSelector],
	(questionEnCours, questionsRépondues) =>
		!!questionEnCours &&
		!!questionsRépondues &&
		!!questionsRépondues.length &&
		questionsRépondues[0] === questionEnCours
)
