import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import SalaryExplanation from '../../../../components/SalaryExplanation'

const AssimiléSalarié = () => (
	<>
		<Helmet>
			<title>
				Assimilé salarié : simulateur officiel de revenus et cotisations
			</title>
			<meta
				name="description"
				content="Estimez vos revenus en tant qu'assimilé salarié à partir de votre chiffre d'affaire (pour les gérants de SAS, SASU et SARL minoritaire). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
			/>
		</Helmet>
		<h1>Simulateur de revenus pour assimilé salarié</h1>
		<Warning />
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explanation={
				<>
					<p>
						Les gérants égalitaires ou minoritaires de SARL ou les dirigeants de
						SA et SAS sont <strong>assimilés&nbsp;salariés</strong> et relèvent
						du régime général.
					</p>
					<p>
						{emoji('☂️ ')} Le dirigeant a la même protection sociale qu'un
						salarié, mis à part le chômage.
					</p>
					<SalaryExplanation />
				</>
			}
		/>
	</>
)
export default withSimulationConfig(assimiléConfig)(AssimiléSalarié)
