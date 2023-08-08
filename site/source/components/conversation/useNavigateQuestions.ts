import { useEffect } from 'react'
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
import {
	useWorkerEngine,
	WorkerEngine,
} from '@/worker/socialWorkerEngineClient'

export function useNavigateQuestions(workerEngines?: WorkerEngine[]) {
	const dispatch = useDispatch()
	const nextQuestions = useNextQuestions(workerEngines)
	const currentQuestion = useSelector(currentQuestionSelector)

	const missingVariables = useMissingVariables(workerEngines)
	const currentQuestionIsAnswered =
		currentQuestion && !(currentQuestion in missingVariables)

	const previousAnswers = useSelector(answeredQuestionsSelector)

	const goToPrevious = () => {
		dispatch(updateShouldFocusField(true))
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
	}
	const goToNext = () => {
		dispatch(updateShouldFocusField(true))
		if (currentQuestion) {
			dispatch(stepAction(currentQuestion))
		}
	}

	useEffect(() => {
		if (!currentQuestion && nextQuestions[0]) {
			dispatch(goToQuestion(nextQuestions[0]))
		}
	}, [nextQuestions, currentQuestion, dispatch])

	return {
		currentQuestion: currentQuestion ?? nextQuestions[0],
		currentQuestionIsAnswered,
		goToPrevious,
		goToNext,
	}
}
