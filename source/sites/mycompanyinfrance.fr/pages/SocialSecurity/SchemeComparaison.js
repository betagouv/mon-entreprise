import ComparativeTargets from 'Components/ComparativeTargets'
import SimpleSimulation from 'Components/SimpleSimulation'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { createMarkdownDiv } from 'Engine/marked'
import React from 'react'
import { Helmet } from 'react-helmet'

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
		<SimpleSimulation hideUntilUserInput>
			<ComparativeTargets />
		</SimpleSimulation>
	</>
)

export default withSimulationConfig(ComparaisonConfig)(SchemeComparaisonPage)
