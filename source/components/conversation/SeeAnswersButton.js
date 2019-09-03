import { T } from 'Components'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import Answers from './AnswerList'
import './conversation.css'

export default connect(state => ({
	arePreviousAnswers: !!state.conversationSteps.foldedSteps.length
}))(function SeeAnswersButton({ arePreviousAnswers }) {
	const [showAnswerModal, setShowAnswerModal] = useState(false)
	return (
		<>
			{arePreviousAnswers && (
				<button
					className="ui__ small simple  button "
					onClick={() => setShowAnswerModal(true)}>
					<T>Modifier mes réponses</T>
				</button>
			)}
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
		</>
	)
})
