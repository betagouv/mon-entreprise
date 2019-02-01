import Simulation from 'Components/Simulation'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'
import { Helmet } from 'react-helmet'
import Target from './SimpleTarget'

export default props => {
	let Simulateur = withSimulationConfig({
		objectifs: [props.match.params.name]
	})(() => (
		<div className="ui__ container">
			<Helmet>
				<title>TITRE</title>
				<meta name="description" content="DESCRIPTION" />
			</Helmet>
			<h1>TITRE</h1>
			<p>TEXTE INTRO</p>
			<Simulation
				targetsTriggerConversation={false}
				targets={<Target />}
				explication={<p>PTITE EXPLICATION DU RESULTAT</p>}
			/>
		</div>
	))

	return <Simulateur />
}
