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
    background: var(--color);
    color: var(--textColor);
	border-radius: .3rem;
	padding: .1rem .6rem;
	font-size: 100%;
	margin: .1rem;
	box-shadow: 0px 2px 4px -1px rgba(41,117,209,0.2),0px 4px 5px 0px rgba(41,117,209,0.14),0px 1px 10px 0px rgba(41,117,209,0.12);
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
				display: flex;
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
