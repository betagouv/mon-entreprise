import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { QuestionEnCours } from '@/components/conversation/QuestionEnCours'
import { VousAvezComplétéCetteSimulation } from '@/components/conversation/VousAvezComplétéCetteSimulation'
import { questionsRéponduesEncoreApplicablesNomsSelector } from '@/store/selectors/questionsRéponduesEncoreApplicablesNoms.selector'

import AnswerList from './AnswerList'
import { useNavigateQuestions } from './useNavigateQuestions'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customSituationVisualisation?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	customSituationVisualisation,
}: ConversationProps) {
	const previousAnswers = useSelector(
		questionsRéponduesEncoreApplicablesNomsSelector
	)

	const { currentQuestion } = useNavigateQuestions()

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
						previousAnswers={previousAnswers}
						customSituationVisualisation={customSituationVisualisation}
					/>
				) : (
					<VousAvezComplétéCetteSimulation
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
