import { useState } from 'react'
import { Trans } from 'react-i18next'
import Answers from './AnswerList'
import './conversation.css'

export default function SeeAnswersButton() {
	const [showAnswerModal, setShowAnswerModal] = useState(false)
	return (
		<>
			<button
				className="ui__ small  button "
				onClick={() => setShowAnswerModal(true)}
			>
				<Trans>Voir mes paramètres</Trans>
			</button>
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
		</>
	)
}
