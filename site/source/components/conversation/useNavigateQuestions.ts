import { WorkerEngine } from '@publicodes/worker-react'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useNextQuestions } from '@/hooks/useNextQuestion'
import {
	goToQuestion,
	stepAction,
	updateShouldFocusField,
} from '@/store/actions/actions'
import {
	answeredQuestionsSelector,
	currentQuestionSelector,
	useMissingVariables,
} from '@/store/selectors/simulationSelectors'

export function useNavigateQuestions(workerEngines?: WorkerEngine[]) {
	const dispatch = useDispatch()
	const nextQuestions = useNextQuestions(workerEngines)
	const nextQuestion =
		nextQuestions !== 'IS_LOADING' ? nextQuestions[0] : undefined
	const currentQuestion = useSelector(currentQuestionSelector)

	const previousAnswers = useSelector(answeredQuestionsSelector)

	const goToPrevious = useCallback(() => {
		dispatch(updateShouldFocusField(true))
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
	}, [dispatch, previousAnswers])

	const goToNext = useCallback(() => {
		dispatch(updateShouldFocusField(true))
		if (currentQuestion) {
			dispatch(stepAction(currentQuestion))
		}
	}, [currentQuestion, dispatch, nextQuestions])

	useEffect(() => {
		if (!currentQuestion && nextQuestion) {
			dispatch(goToQuestion(nextQuestion))
		}
	}, [currentQuestion, dispatch, nextQuestions])

	return {
		isLoading: nextQuestions === 'IS_LOADING',
		currentQuestion: currentQuestion ?? nextQuestion,
		goToPrevious,
		goToNext,
	}
}

export function useCurrentQuestionIsAnswered() {
	const currentQuestion = useSelector(currentQuestionSelector)
	const missingVariables = useMissingVariables()

	return (
		currentQuestion &&
		missingVariables !== 'IS_LOADING' &&
		!(currentQuestion in missingVariables)
	)
}
