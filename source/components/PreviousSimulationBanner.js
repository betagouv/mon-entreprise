/* @flow */
import { compose } from 'ramda'
import React from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { deletePreviousSimulation, loadPreviousSimulation } from '../actions'
import Banner from './Banner'
import { LinkButton } from './ui/Button'

import type { SavedSimulation } from '../types/State'

type ConnectedPropTypes = {
	previousSimulation: SavedSimulation,
	loadPreviousSimulation: () => void,
	deletePreviousSimulation: () => void
}
const PreviousSimulationBanner = ({
	previousSimulation,
	deletePreviousSimulation,
	loadPreviousSimulation
}: ConnectedPropTypes) => (
	<Banner hidden={!previousSimulation}>
		<Trans i18nKey="previousSimulationBanner.info">
			Votre précédente simulation a été sauvegardée.
		</Trans>
		<LinkButton onClick={loadPreviousSimulation}>
			<Trans i18nKey="previousSimulationBanner.retrieveButton">
				Retrouver ma simulation
			</Trans>
		</LinkButton>
		<LinkButton onClick={deletePreviousSimulation}>
			<Trans>Effacer</Trans>
		</LinkButton>
	</Banner>
)

export default compose(
	translate(),
	connect(
		({ previousSimulation }) => ({ previousSimulation }),
		{
			loadPreviousSimulation,
			deletePreviousSimulation
		}
	)
)(PreviousSimulationBanner)
