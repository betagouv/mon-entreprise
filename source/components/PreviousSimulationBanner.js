/* @flow */
import {
	deletePreviousSimulation,
	loadPreviousSimulation
} from 'Actions/actions'
import { compose } from 'ramda'
import React from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { noUserInputSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import Banner from './Banner'

import type { SavedSimulation } from 'Types/State'

type ConnectedPropTypes = {
	previousSimulation: SavedSimulation,
	loadPreviousSimulation: () => void,
	newSimulationStarted: boolean,
	deletePreviousSimulation: () => void
}
const PreviousSimulationBanner = ({
	previousSimulation,
	deletePreviousSimulation,
	newSimulationStarted,
	loadPreviousSimulation
}: ConnectedPropTypes) => (
	<Banner hidden={!previousSimulation || newSimulationStarted} icon="💾">
		<Trans i18nKey="previousSimulationBanner.info">
			Votre précédente simulation a été sauvegardée.
		</Trans>{' '}
		<LinkButton onClick={loadPreviousSimulation}>
			<Trans i18nKey="previousSimulationBanner.retrieveButton">
				Retrouver ma simulation
			</Trans>
		</LinkButton>
		.{' '}
		<LinkButton onClick={deletePreviousSimulation}>
			<Trans>Effacer</Trans>
		</LinkButton>
	</Banner>
)

export default compose(
	withTranslation(),
	connect(
		state => ({
			previousSimulation: state.previousSimulation,
			newSimulationStarted: !noUserInputSelector(state)
		}),
		{
			loadPreviousSimulation,
			deletePreviousSimulation
		}
	)
)(PreviousSimulationBanner)
