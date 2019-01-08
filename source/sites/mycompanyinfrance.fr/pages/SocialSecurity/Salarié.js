import Simulateur from 'Components/Simu'
import salariéConfig from 'Components/simulationConfigs/salarié.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'

const Salarié = () => (
	<>
		<p>
			Dès que l'embauche d'un salarié est déclarée et qu'il est payé, il est
			couvert par le régime général de la Sécurité sociale (santé, maternité,
			invalidité, vieillesse, maladie professionnelle et accidents) et chômage.
		</p>
		<Simulateur />
	</>
)
export default withSimulationConfig(salariéConfig)(Salarié)
