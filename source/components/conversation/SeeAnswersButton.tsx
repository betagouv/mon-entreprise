import { T } from 'Components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import Answers from './AnswerList'
import './conversation.css'

export default function SeeAnswersButton() {
	const arePreviousAnswers = !!useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps.length
	)
	const [showAnswerModal, setShowAnswerModal] = useState(false)
	return (
		<>
			{arePreviousAnswers && (
				<button
					className="ui__ small simple  button "
					onClick={() => setShowAnswerModal(true)}
				>
					<T>Modifier mes réponses</T>
				</button>
			)}
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
		</>
	)
}
