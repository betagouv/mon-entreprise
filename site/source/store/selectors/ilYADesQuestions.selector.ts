import { createSelector } from 'reselect'

import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'
import { questionsSuivantesSelector } from '@/store/selectors/questionsSuivantes.selector'

export const ilYADesQuestionsSelector = createSelector(
	[
		currentQuestionSelector,
		questionsSuivantesSelector,
		questionsRéponduesSelector,
	],
	(questionEnCours, questionsSuivantes, questionsRépondues) =>
		!!questionEnCours ||
		!!questionsSuivantes.length ||
		!!questionsRépondues.length
)
