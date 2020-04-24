import React, { useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import Answers from './AnswerList'
import './conversation.css'

export default function SeeAnswersButton() {
	const [showAnswerModal, setShowAnswerModal] = useState(false)
	return (
		<>
			<button
				className="ui__ small simple  button "
				onClick={() => setShowAnswerModal(true)}
			>
				<Trans>Voir toutes les questions</Trans>
			</button>
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
		</>
	)
}
