import ComparativeTargets from 'Components/ComparativeTargets'
import Warning from 'Components/SimulateurWarning'
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
				Assimilé salarié, indépendant, auto-entrepreneur : comparaison des
				régimes
			</title>
			<meta
				name="description"
				content="A partir d'un chiffre d'affaire donné, comparez le revenus net obtenu
				après paiement des cotisations sociale et impôts pour les différents
				régimes."
			/>
		</Helmet>
		<Animate.fromBottom>
			<h1>Comparaison des régimes de protection sociale</h1>
			<header>{createMarkdownDiv(ComparaisonConfig.titre)}</header>
			<Simulation
				showTargetsAnyway
				targets={<ComparativeTargets />}
				noFeedback
			/>
		</Animate.fromBottom>
		<Warning />
	</>
)

export default withSimulationConfig(ComparaisonConfig)(SchemeComparaisonPage)
