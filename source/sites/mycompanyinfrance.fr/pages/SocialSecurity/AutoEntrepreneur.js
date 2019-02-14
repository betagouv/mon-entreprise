import AlphaWarning from 'Components/AlphaWarning'
import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { Helmet } from 'react-helmet'
import { AvertissementProtectionSocialeIndépendants } from './Indépendant'

const AutoEntrepreneur = () => (
	<>
		<Helmet>
			<title>Auto-entrepreneur : cotisations et protection sociale </title>
			<meta
				name="description"
				content="Simulez votre rémunération en tant que dirigeant indépendant. Calcul complet de toutes les cotisations. Découvrez les droits ouverts par votre affiliation au régime des indépendants (TNS)"
			/>
		</Helmet>
		<h1>Auto-entrepreneur : cotisations et droits</h1>
		<p>
			Les auto-entrepreneurs relèvent de la sécurité sociale des indépendants.
		</p>

		<AlphaWarning />
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explanation={<AvertissementProtectionSocialeIndépendants />}
		/>
	</>
)
export default withSimulationConfig(indépendantConfig)(AutoEntrepreneur)
