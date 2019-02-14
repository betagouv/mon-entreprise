import AlphaWarning from 'Components/AlphaWarning'
import Simulation from 'Components/Simulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'

const AssimiléSalarié = () => (
	<>
		<Helmet>
			<title>
				Dirigeant assimilé salarié : cotisations et protection sociale
			</title>
			<meta
				name="description"
				content="Simulez votre rémunération en tant que dirigeant assimilé salarié. Calcul complet de toutes les cotisations. Découvrez les droits ouverts par votre affiliation au régime général"
			/>
		</Helmet>
		<h1>Assimilé salarié : cotisation et droits</h1>
		<p>
			Les gérants égalitaires ou minoritaires de SARL ou les dirigeants de SA et
			SAS sont <strong>assimilés&nbsp;salariés</strong> et relèvent du régime
			général. Les cotisations sociales sont proches de celles des salariés, à
			quelques exceptions près (réductions employeur et chômage en moins).
		</p>
		<AlphaWarning />
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explanation={
				<p>
					{emoji('☂️ ')} Le dirigeant a la même protection sociale qu'un
					salarié, mis à part le chômage.
				</p>
			}
		/>
	</>
)
export default withSimulationConfig(assimiléConfig)(AssimiléSalarié)
