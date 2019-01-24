import AlphaWarning from 'Components/AlphaWarning'
import ComparativeTargets from 'Components/ComparativeTargets'
import Simulation from 'Components/Simulation'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { createMarkdownDiv } from 'Engine/marked'
import React from 'react'
import { Helmet } from 'react-helmet'
import Animate from 'Ui/animate'
const SchemeComparaisonPage = () => (
	<>
		<Helmet>
			<title>
				Assimilé salarié, indépendant, micro-entreprise : comparaison des
				différents régimes
			</title>
		</Helmet>
		<Animate.fromBottom>
			<h1>Comparaison des régimes</h1>
			<header>{createMarkdownDiv(ComparaisonConfig.titre)}</header>
			<AlphaWarning />
			<Simulation
				showTargetsAnyway
				targets={<ComparativeTargets />}
				explication={<p />}
			/>
		</Animate.fromBottom>
	</>
)

export default withSimulationConfig(ComparaisonConfig)(SchemeComparaisonPage)
