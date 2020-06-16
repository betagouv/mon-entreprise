import {
	deletePreviousSimulation,
	loadPreviousSimulation,
} from 'Actions/actions'
import React, { useState } from 'react'
import { T } from 'Components'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { noUserInputSelector } from 'Selectors/analyseSelectors'
import emoji from 'react-easy-emoji'
import { Button } from 'Components/ui/Button'
import Answers from './conversation/AnswerList'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = !useSelector(noUserInputSelector)
	const dispatch = useDispatch()
	const arePreviousAnswers = !!useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps.length
	)
	const [showAnswerModal, setShowAnswerModal] = useState(false)

	return (
		<div
			css={`
				display: flex;
				justify-content: center;
				button {
					margin: 0 0.2rem;
				}
			`}
		>
			{arePreviousAnswers && (
				<Button
					className="simple small"
					onClick={() => setShowAnswerModal(true)}
				>
					{emoji('📋 ')}
					<T>Modifier mes réponses</T>
				</Button>
			)}
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
			{previousSimulation && !newSimulationStarted && (
				<>
					<Button
						className="simple small"
						onClick={() => dispatch(loadPreviousSimulation())}
					>
						{emoji('💾 ')}
						<Trans>Ma dernière simulation</Trans>
					</Button>
					<Button
						className="simple small"
						onClick={() => dispatch(deletePreviousSimulation())}
					>
						{emoji('🗑️ ')}
						<Trans>Effacer</Trans>
					</Button>
				</>
			)}
		</div>
	)
}
