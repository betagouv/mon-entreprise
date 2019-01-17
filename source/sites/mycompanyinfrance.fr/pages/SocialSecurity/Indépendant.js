import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { Helmet } from 'react-helmet'

const Indépendant = () => (
	<>
		<Helmet>
			<title>Dirigeant indépendant : cotisations et protection sociale </title>
			<meta
				name="description"
				content="Simulez votre rémunération en tant que dirigeant indépendant. Calcul complet de toutes les cotisations. Découvrez les droits ouverts par votre affiliation au régime des indépendants (TNS)"
			/>
		</Helmet>
		<h1>
			Dirigeant indépendant : cotisations et droits
			<small id="betaTag">alpha</small>
		</h1>
		<p>
			Les personnes suivantes relèvent de la sécurité sociale des indépendants :
		</p>
		<ul>
			<li> entrepreneurs individuels et EIRL</li>
			<li> gérants et associés de SNC et EURL</li>
			<li> gérant majoritaire de SARL</li>
		</ul>
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explication={
				<p>
					La sécurité sociale des indépendants ne couvre ni les accidents du
					travail, ni la perte d'emploi (assurance-chômage). Pour être couvert,
					le professionnel peut souscrire volontairement des assurances
					spécifiques.
				</p>
			}
		/>
	</>
)
export default withSimulationConfig(indépendantConfig)(Indépendant)
