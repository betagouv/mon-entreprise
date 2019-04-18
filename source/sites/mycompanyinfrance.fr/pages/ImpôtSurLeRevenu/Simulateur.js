import Simulation from 'Components/Simulation'
import config from './simulateur.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import Targets from 'Components/Targets'
import { compose } from 'ramda'
import React from 'react'
import { withTranslation } from 'react-i18next'

export default compose(
	withSimulationConfig(config),
	withTranslation()
)(() => (
	<>
		<Simulation
			targets={<Targets />}
			showTargetsAnyway={true}
			explanation={
				<>
					Mais{' '}
					<a href="https://www.aquoiserventmesimpots.gouv.fr">
						à quoi donc servent mes impôts ?{' '}
					</a>
				</>
			}
		/>
	</>
))
