import SalaryExplanation from 'Components/SalaryExplanation'
import Warning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import assimiléConfig from 'Components/simulationConfigs/assimilé.yaml'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'

export default function AssimiléSalarié() {
	const { t } = useTranslation()
	const inIframe = useContext(IsEmbeddedContext)

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
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.assimilé-salarié.titre">
						Simulateur de revenus assimilé salarié
					</Trans>
				</h1>
			)}
			<Warning simulateur="assimilé-salarié" />
			<Simulation
				config={assimiléConfig}
				explanations={<SalaryExplanation />}
			/>
		</>
	)
}
