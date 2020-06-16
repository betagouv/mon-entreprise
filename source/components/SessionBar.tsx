import {
	deletePreviousSimulation,
	loadPreviousSimulation,
} from 'Actions/actions'
import React from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { noUserInputSelector } from 'Selectors/analyseSelectors'
import emoji from 'react-easy-emoji'

const buttonStyle = `
	font-size: 100%;
	margin: .1rem;
`

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = !useSelector(noUserInputSelector)
	const dispatch = useDispatch()

	if (!previousSimulation || newSimulationStarted) return null
	return (
		<div
			css={`
				box-shadow: 0 0 0 1px #aaa, 0 1px 3px 0 rgba(0, 0, 0, 0.08);
				display: flex;
				border-radius: 0.3rem;
				padding: 0.1rem 0.6rem;
				justify-content: center;
			`}
		>
			<button
				css={buttonStyle}
				onClick={() => dispatch(loadPreviousSimulation())}
			>
				{emoji('💾 ')}
				<Trans>Ma dernière simulation</Trans>
			</button>
			<button
				css={buttonStyle}
				onClick={() => dispatch(deletePreviousSimulation())}
			>
				{emoji('🗑️ ')}
				<Trans>Effacer</Trans>
			</button>
		</div>
	)
}
