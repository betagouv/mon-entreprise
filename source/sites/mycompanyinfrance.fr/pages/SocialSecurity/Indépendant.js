import Simulateur from 'Components/Simu'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import React from 'react'

const Indépendant = () => (
	<>
		<p>
			Relèvent de la sécurité sociale des indépendants, les travailleurs
			indépendants suivants :
		</p>
		<ul>
			<li> entrepreneurs individuels et EIRL</li>
			<li> gérants et associés de SNC et EURL</li>
			<li> gérant majoritaire de SARL</li>
		</ul>
		<p>
			La sécurité sociale des indépendants ne couvre ni les accidents du
			travail, ni la perte d'emploi (assurance-chômage). Pour être couvert, le
			professionnel peut souscrire volontairement des assurances spécifiques.
		</p>
		<Simulateur />
	</>
)
export default withSimulationConfig(indépendantConfig)(Indépendant)
