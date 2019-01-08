import ComparativeSimulation from 'Components/ComparativeSimulation'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'
import { Helmet } from 'react-helmet'
import { createMarkdownDiv } from 'Engine/marked'

const SchemeComparaisonPage = () => (
	<>
		<Helmet>
			<title>
				Assimilé salarié, indépendant, micro-entreprise : comparaison des
				différents régimes
			</title>
		</Helmet>
		<h1>
			Comparaison des régimes <small id="betaTag">alpha</small>
		</h1>
		<header>{createMarkdownDiv(ComparaisonConfig.titre)}</header>
		<ComparativeSimulation />
	</>
)

export default withSimulationConfig(ComparaisonConfig)(SchemeComparaisonPage)
