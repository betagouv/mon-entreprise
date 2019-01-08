import Simulateur from 'Components/Simu'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'

const AssimiléSalarié = () => (
	<>
		<p>
			Les gérants égalitaires ou minoritaires de SARL ou les dirigeants de SA et
			SAS sont <strong>assimilés&nbsp;salariés</strong> et relèvent du régime
			général. Les cotisations sociales sont proches de celles des salariés, à
			quelques exceptions près (chômage en moins).
		</p>
		<Simulateur />
	</>
)
export default withSimulationConfig(assimiléConfig)(AssimiléSalarié)
