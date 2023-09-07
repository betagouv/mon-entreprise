import { WorkerEngine } from '@publicodes/worker-react'
import { useCallback, useEffect, useRef } from 'react'
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
	const currentQuestion = useSelector(currentQuestionSelector)

	const missingVariables = useMissingVariables(workerEngines)
	const currentQuestionIsAnswered =
		currentQuestion && !(currentQuestion in missingVariables)

	const previousAnswers = useSelector(answeredQuestionsSelector)

	const goToPrevious = useCallback(() => {
		dispatch(updateShouldFocusField(true))
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
	}, [dispatch, previousAnswers])

	const goToNext = useCallback(() => {
		dispatch(updateShouldFocusField(true))
		if (currentQuestion) {
			dispatch(stepAction(currentQuestion))
			// dispatch(goToQuestion(nextQuestions[0]))
			nextQuestions.length > 1 && dispatch(goToQuestion(nextQuestions[1]))
		}
	}, [currentQuestion, dispatch, nextQuestions])

	const init = useRef(false)
	useEffect(() => {
		if (!init.current && !currentQuestion && nextQuestions.length) {
			dispatch(goToQuestion(nextQuestions[0]))
			init.current = true
		}
	}, [currentQuestion, dispatch, nextQuestions])

	return {
		currentQuestion: currentQuestion ?? nextQuestions[0],
		currentQuestionIsAnswered,
		goToPrevious,
		goToNext,
	}
}
