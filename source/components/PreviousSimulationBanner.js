/* @flow */
import { compose } from 'ramda'
import React from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { loadPreviousSimulation as loadPreviousSimulationAction } from '../actions'
import Banner from './Banner'

import type { SavedSimulation } from '../types/State'

type ConnectedPropTypes = {
	previousSimulation: SavedSimulation,
	loadPreviousSimulation: () => void
}
const PreviousSimulationBanner = ({
	previousSimulation,
	loadPreviousSimulation
}: ConnectedPropTypes) => (
	<Banner hidden={!previousSimulation}>
		<Trans i18nKey="previousSimulationBanner.info">
			Votre précédente simulation a été automatiquement sauvegardée.
		</Trans>
		<button
			className="unstyledButton linkButton"
			onClick={loadPreviousSimulation}>
			<Trans i18nKey="previousSimulationBanner.retrieveButton">
				Retrouver ma dernière simulation
			</Trans>
		</button>
	</Banner>
)

export default compose(
	translate(),
	connect(({ previousSimulation }) => ({ previousSimulation }), {
		loadPreviousSimulation: loadPreviousSimulationAction
	})
)(PreviousSimulationBanner)
