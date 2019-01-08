import ComparativeSimulation from 'Components/ComparativeSimulation'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
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
		<h1>Comparaison des différents régimes de cotisation</h1>
		<p>
			Calcul du{' '}
			<strong>
				revenu du travailleur indépendant ou dirigeant d'entreprise
			</strong>
			, en fonction de son choix de régime social. Nous faisons les hypothèses
			suivantes : tout le chiffre d'affaires sert à payer le dirigeant. L'impôt
			est calculé pour un célibataire sans enfants et sans autre revenu. Version
			beta, beaucoup d'améliorations à venir !
		</p>
		<ComparativeSimulation />
	</>
)

export default withSimulationConfig(ComparaisonConfig)(SchemeComparaisonPage)
