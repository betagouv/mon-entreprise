import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
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

export function useNavigateQuestions(engines?: Array<Engine<DottedName>>) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const nextQuestion = useNextQuestions(engines)[0]
	const currentQuestion = useSelector(currentQuestionSelector)

	const missingVariables = useMissingVariables({ engines: engines ?? [engine] })
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
		if (!currentQuestion && nextQuestion) {
			dispatch(goToQuestion(nextQuestion))
		}
	}, [nextQuestion, currentQuestion])

	return {
		currentQuestion: currentQuestion ?? nextQuestion,
		currentQuestionIsAnswered,
		goToPrevious,
		goToNext,
	}
}
