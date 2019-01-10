import SimpleSimulation from 'Components/SimpleSimulation'
import indépendantConfig from 'Components/simulationConfigs/micro-entreprise.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { Helmet } from 'react-helmet'

const MicroEntreprise = () => (
	<>
		<Helmet>
			<title>Micro-entreprise : cotisations et protection sociale </title>
			<meta
				name="description"
				content="Simulez votre rémunération en tant que dirigeant indépendant. Calcul complet de toutes les cotisations. Découvrez les droits ouverts par votre affiliation au régime des indépendants (TNS)"
			/>
		</Helmet>
		<h1>
			Micro-entreprise : cotisations et droits
			<small id="betaTag">alpha</small>
		</h1>
		<p>
			Les micro-entreprises relèvent de la sécurité sociale des indépendants.
		</p>
		<p>
			La sécurité sociale des indépendants ne couvre ni les accidents du
			travail, ni la perte d'emploi (assurance-chômage). Pour être couvert, le
			professionnel peut souscrire volontairement des assurances spécifiques.
		</p>
		<SimpleSimulation>
			<TargetSelection keepFormValues />
		</SimpleSimulation>
	</>
)
export default withSimulationConfig(indépendantConfig)(MicroEntreprise)
