import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { QuestionEnCours } from '@/components/conversation/QuestionEnCours'
import { VousAvezComplétéCetteSimulation } from '@/components/conversation/VousAvezComplétéCetteSimulation'
import { answeredQuestionsSelector } from '@/store/selectors/simulationSelectors'

import AnswerList from './AnswerList'
import { useNavigateQuestions } from './useNavigateQuestions'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
	engines?: Array<Engine<DottedName>>
}

export default function Conversation({
	customEndMessages,
	customSituationVisualisation,
	engines,
}: ConversationProps) {
	const { t } = useTranslation()
	const previousAnswers = useSelector(answeredQuestionsSelector)

	const { currentQuestion, nextQuestion } = useNavigateQuestions(engines)

	const [firstRenderDone, setFirstRenderDone] = useState(false)
	useEffect(() => setFirstRenderDone(true), [])

	return (
		<>
			<div className="print-only">
				<AnswerList
					onClose={() => {
						// do nothing.
					}}
				>
					{customSituationVisualisation}
				</AnswerList>
			</div>
			<div className="print-hidden">
				{currentQuestion ? (
					<QuestionEnCours
						engines={engines}
						previousAnswers={previousAnswers}
						customSituationVisualisation={customSituationVisualisation}
					/>
				) : nextQuestion ? (
					t('Chargement de la question suivante')
				) : (
					<VousAvezComplétéCetteSimulation
						engines={engines}
						firstRenderDone={firstRenderDone}
						customEndMessages={customEndMessages}
						previousAnswers={previousAnswers}
						customSituationVisualisation={customSituationVisualisation}
					/>
				)}
			</div>
		</>
	)
}
