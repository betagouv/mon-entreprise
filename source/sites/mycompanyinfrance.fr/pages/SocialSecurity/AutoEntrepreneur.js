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
			<title>
				Auto-entrepreneur : simulateur officiel de revenus et cotisations
			</title>
			<meta
				name="description"
				content="Estimez vos revenus en tant qu'auto-entrepreneur à partir de votre chiffre d'affaire. Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'URSSAF"
			/>
		</Helmet>
		<h1>Simulateur de revenus pour auto-entrepreneur</h1>
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
