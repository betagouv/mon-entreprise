import ComparativeSimulation from 'Components/ComparativeSimulation'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'
import { Helmet } from 'react-helmet'

const Simulation = withSimulationConfig(ComparaisonConfig)(
	ComparativeSimulation
)

const SchemeComparaisonPage = () => (
	<>
		<Helmet>
			<title>
				Assimilé salarié, indépendant, micro-entreprise : comparaison des
				différents régimes
			</title>
		</Helmet>
		<h1>Comparaison des différents régimes de cotisation</h1>
		<Simulation />
	</>
)

export default SchemeComparaisonPage
