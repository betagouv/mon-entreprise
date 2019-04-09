import { T } from 'Components'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import SalaryExplanation from '../../../../components/SalaryExplanation'

const AssimiléSalarié = ({ t }) => (
	<>
		<Helmet>
			<title>
				{t([
					'simulateurs.assimilé-salarié.page.titre',
					'Assimilé salarié : simulateur officiel de revenus et cotisations'
				])}
			</title>
			<meta
				name="description"
				content={t([
					'simulateurs.assimilé-salarié.page.description',
					"Estimez vos revenus en tant qu'assimilé salarié à partir de votre chiffre d'affaire (pour les gérants de SAS, SASU et SARL minoritaire). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
				])}
			/>
		</Helmet>
		<h1>
			<T k="simulateurs.assimilé-salarié.titre">
				Simulateur de revenus pour assimilé salarié
			</T>
		</h1>
		<Warning />
		<Simulation
			targetsTriggerConversation={true}
			targets={<TargetSelection />}
			explanation={
				<>
					<p>
						{emoji('☂️ ')}{' '}
						<T k="simulateurs.assimilé-salarié.explications">
							Les gérants égalitaires ou minoritaires de SARL ou les dirigeants
							de SA et SAS sont assimilés salariés et relèvent du régime
							général. Par conséquent, le dirigeant a la même protection sociale
							qu'un salarié, mis à part le chômage.
						</T>
					</p>
					<SalaryExplanation />
				</>
			}
		/>
	</>
)
export default compose(
	withSimulationConfig(assimiléConfig),
	withTranslation()
)(AssimiléSalarié)
