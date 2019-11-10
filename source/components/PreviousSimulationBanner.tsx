import {
	deletePreviousSimulation,
	loadPreviousSimulation
} from 'Actions/actions'
import React from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { noUserInputSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import Banner from './Banner'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = !useSelector(noUserInputSelector)
	const dispatch = useDispatch()

	return (
		<Banner hidden={!previousSimulation || newSimulationStarted} icon="💾">
			<Trans i18nKey="previousSimulationBanner.info">
				Votre précédente simulation a été sauvegardée.
			</Trans>{' '}
			<LinkButton onClick={() => dispatch(loadPreviousSimulation())}>
				<Trans i18nKey="previousSimulationBanner.retrieveButton">
					Retrouver ma simulation
				</Trans>
			</LinkButton>
			.{' '}
			<LinkButton onClick={() => dispatch(deletePreviousSimulation())}>
				<Trans>Effacer</Trans>
			</LinkButton>
		</Banner>
	)
}
