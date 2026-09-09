import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsSuivantesSelector } from '@/store/selectors/questionsSuivantes.selector'

export const questionEnCoursRépondueSelector = createSelector(
	[currentQuestionSelector, questionsSuivantesSelector],
	(questionEnCours, questionsSuivantes) =>
		!!questionEnCours &&
		!!questionsSuivantes &&
		!questionsSuivantes.includes(questionEnCours)
)
