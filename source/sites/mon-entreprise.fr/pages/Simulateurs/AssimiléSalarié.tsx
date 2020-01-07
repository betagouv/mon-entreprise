import { setSimulationConfig } from 'Actions/actions'
import { T } from 'Components'
import SalaryExplanation from 'Components/SalaryExplanation'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'

export default function AssimiléSalarié() {
	const dispatch = useDispatch()
	const location = useLocation()
	dispatch(setSimulationConfig(assimiléConfig, location.state?.fromGérer))

	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.assimilé-salarié.page.titre',
						'Assimilé salarié : simulateur officiel de revenus et cotisations'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.assimilé-salarié.page.description',
						"Estimez vos revenus en tant qu'assimilé salarié à partir de votre chiffre d'affaire (pour les gérants de SAS, SASU et SARL minoritaire). Prise en compte de toutes les cotisations et de l'impôt sur le revenu. Simulateur officiel de l'Urssaf"
					)}
				/>
			</Helmet>
			<h1>
				<T k="simulateurs.assimilé-salarié.titre">
					Simulateur de revenus assimilé salarié
				</T>
			</h1>
			<Warning simulateur="assimilé-salarié" />
			<Simulation explanations={<SalaryExplanation />} />
		</>
	)
}
