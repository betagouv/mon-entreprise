import { useDispatch, useSelector } from 'react-redux'

import {
	retourneÀLaQuestionPrécédente,
	vaÀLaQuestionSuivante,
} from '@/store/actions/actions'
import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionEnCoursRépondueSelector } from '@/store/selectors/questionEnCoursRépondue.selector'

export function useNavigateQuestions() {
	const dispatch = useDispatch()
	const currentQuestion = useSelector(currentQuestionSelector)

	const currentQuestionIsAnswered = useSelector(questionEnCoursRépondueSelector)

	const goToPrevious = () => {
		dispatch(retourneÀLaQuestionPrécédente())
	}
	const goToNext = () => {
		dispatch(vaÀLaQuestionSuivante())
	}

	return {
		currentQuestion,
		currentQuestionIsAnswered,
		goToPrevious,
		goToNext,
	}
}
