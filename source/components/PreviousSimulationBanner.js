/* @flow */
import React from 'react'
import type { SavedSimulation } from '../types/State'
import { loadPreviousSimulation } from '../actions'
import Banner from './Banner'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

type ConnectedPropTypes = {
	previousSimulation: SavedSimulation,
	loadPreviousSimulation: () => void
}
const PreviousSimulationBanner = ({
	previousSimulation,
	loadPreviousSimulation
}: ConnectedPropTypes) => (
	<Banner hidden={!previousSimulation}>
		<Trans key="previousSimulationBanner">
			Votre précédente simulation a été automatiquement sauvegardée.
		</Trans>
		<button
			className="unstyledButton linkButton"
			onClick={loadPreviousSimulation}>
			<Trans key="previousSimulationBanner.retrieveButton">
				Retrouver ma dernière simulation
			</Trans>
		</button>
	</Banner>
)

export default connect(({ previousSimulation }) => ({ previousSimulation }), {
	loadPreviousSimulation
})(PreviousSimulationBanner)
