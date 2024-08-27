import { useSelector } from 'react-redux'

import { useNextQuestions } from '@/hooks/useNextQuestion'
import { numéroDeLaQuestionEnCoursSelector } from '@/store/selectors/numéroDeLaQuestionEnCours.selector'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

export function useSimulationProgress(): {
	progressRatio: number
	numberCurrentStep: number
	numberSteps: number
	nombreDeQuestionsRépondues: number
} {
	const numberQuestionAnswered = useSelector(questionsRéponduesSelector).length
	const numéroDeLaQuestionEnCours = useSelector(
		numéroDeLaQuestionEnCoursSelector
	)
	const numberQuestionLeft = useNextQuestions().length

	return {
		progressRatio:
			numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft),
		numberCurrentStep: numéroDeLaQuestionEnCours,
		nombreDeQuestionsRépondues: numberQuestionAnswered,
		numberSteps: numberQuestionAnswered + numberQuestionLeft,
	}
}
