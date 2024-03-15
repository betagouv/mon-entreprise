import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import {
	retourneÀLaQuestionPrécédente,
	updateShouldFocusField,
	vaÀLaQuestionSuivante,
} from '@/store/actions/actions'
import {
	currentQuestionSelector,
	urlSelector,
	useMissingVariables,
} from '@/store/selectors/simulationSelectors'

export function useNavigateQuestions(engines?: Array<Engine<DottedName>>) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const nextQuestion = useNextQuestions(engines)[0]
	const currentQuestion = useSelector(currentQuestionSelector)
	const url = useSelector(urlSelector)

	const missingVariables = useMissingVariables({ engines: engines ?? [engine] })
	const currentQuestionIsAnswered =
		currentQuestion && !(currentQuestion in missingVariables)

	const goToPrevious = () => {
		dispatch(updateShouldFocusField(true))
		dispatch(retourneÀLaQuestionPrécédente())
	}
	const goToNext = () => {
		dispatch(updateShouldFocusField(true))
		dispatch(vaÀLaQuestionSuivante())
	}

	// TODO Est-ce toujours utile ?
	// Vérifier en changeant de simulateur
	useEffect(() => {
		dispatch(vaÀLaQuestionSuivante())
	}, [url])

	return {
		currentQuestion,
		nextQuestion,
		currentQuestionIsAnswered,
		goToPrevious,
		goToNext,
	}
}
