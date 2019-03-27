import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { Helmet } from 'react-helmet'
import { AvertissementProtectionSocialeIndépendants } from './Indépendant'

const AutoEntrepreneur = ({ noUserInput }) => (
	<>
		<Helmet>
			<title>
				Auto-entrepreneur : simulateur officiel de revenus et cotisations
			</title>
			<meta
				name="description"
				content="Estimez vos revenus en tant qu'auto-entrepreneur à partir de votre chiffre d'affaire. Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
			/>
		</Helmet>
		<h1>Simulateur auto-entrepreneur 2019</h1>
		<Warning autoFolded={!noUserInput} simulateur="auto-entreprise" />
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explanation={<AvertissementProtectionSocialeIndépendants />}
		/>
	</>
)
export default withSimulationConfig(indépendantConfig)(AutoEntrepreneur)
