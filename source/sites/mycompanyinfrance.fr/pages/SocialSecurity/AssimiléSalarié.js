import SimpleSimulation from 'Components/SimpleSimulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
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
			quelques exceptions près (chômage en moins).
		</p>
		<SimpleSimulation>
			<TargetSelection />
		</SimpleSimulation>
	</>
)
export default withSimulationConfig(assimiléConfig)(AssimiléSalarié)
