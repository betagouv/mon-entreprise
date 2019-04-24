import { T } from 'Components'
import PageFeedback from 'Components/Feedback/PageFeedback'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import indépendantConfig from 'Components/simulationConfigs/auto-entrepreneur.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import { compose } from 'ramda'
import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { AvertissementProtectionSocialeIndépendants } from './Indépendant'

const AutoEntrepreneur = ({ t }) => (
	<>
		<Helmet>
			<title>
				{t([
					'simulateurs.auto-entrepreneur.page.titre',
					'Auto-entrepreneur : simulateur officiel de revenus et de cotisations'
				])}
			</title>
			<meta
				name="description"
				content={t([
					'simulateurs.auto-entrepreneur.page.description',
					"Estimez vos revenus en tant qu'auto-entrepreneur à partir de votre chiffre d'affaire. Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
				])}
			/>
		</Helmet>
		<h1>
			<T k="simulateurs.auto-entrepreneur.titre">
				Simulateur de revenus auto-entrepreneur
			</T>
		</h1>
		<Warning simulateur="auto-entreprise" />
		<Simulation
			targetsTriggerConversation={true}
			targets={
				<TargetSelection
					explanation={
						<>
							<AvertissementProtectionSocialeIndépendants />
							<PageFeedback
								customMessage={
									<T k="feedback.simulator">
										Êtes-vous satisfait de ce simulateur ?
									</T>
								}
								customEventName="rate simulator"
							/>
						</>
					}
				/>
			}
		/>
	</>
)
export default compose(
	withTranslation(),
	withSimulationConfig(indépendantConfig)
)(AutoEntrepreneur)
