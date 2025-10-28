import { useSelector } from 'react-redux'

import { useNextQuestions } from '@/hooks/useNextQuestion'
import { numéroDeLaQuestionEnCoursSelector } from '@/store/selectors/simulation/questions/numéroDeLaQuestionEnCours.selector'
import { questionsRéponduesEncoreApplicablesSelector } from '@/store/selectors/simulation/questions/questionsRéponduesEncoreApplicables.selector'

export function useSimulationProgress(): {
	progressRatio: number
	numberCurrentStep: number
	numberSteps: number
	nombreDeQuestionsRépondues: number
} {
	const numberQuestionAnswered = useSelector(
		questionsRéponduesEncoreApplicablesSelector
	).length
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
