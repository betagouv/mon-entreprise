import SimpleSimulation from 'Components/SimpleSimulation'
import indépendantConfig from 'Components/simulationConfigs/indépendant.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { Helmet } from 'react-helmet'

const Indépendant = () => (
	<>
		<Helmet>
			<title>
				Auto-entrepreneur : cotisations et protection sociale{' '}
				<small id="betaTag">alpha</small>
			</title>
			<meta
				name="description"
				content="Simulez votre rémunération en tant que dirigeant indépendant. Calcul complet de toutes les cotisations. Découvrez les droits ouverts par votre affiliation au régime des indépendants (TNS)"
			/>
		</Helmet>
		<h1>Auto-entrepreneur : cotisations et droits </h1>
		<p>
			Les auto-entrepreneurs relèvent de la sécurité sociale des indépendants.
		</p>
		<p>
			La sécurité sociale des indépendants ne couvre ni les accidents du
			travail, ni la perte d'emploi (assurance-chômage). Pour être couvert, le
			professionnel peut souscrire volontairement des assurances spécifiques.
		</p>
		<SimpleSimulation>
			<TargetSelection />
		</SimpleSimulation>
	</>
)
export default withSimulationConfig(indépendantConfig)(Indépendant)
