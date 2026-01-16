import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Body } from '@/design-system'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import useSimulatorsData, { SimulateurId } from '@/hooks/useSimulatorsData'
import { useUrl } from '@/hooks/useUrl'
import { CessationActivitéGoals } from '@/pages/simulateurs/cessation-activité/Goals'
import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'
import { omit } from '@/utils'
import { URSSAF } from '@/utils/logos'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'

const nextSteps = ['indépendant'] satisfies SimulateurId[]

export const CessationActivitéSimulation = () => {
	const id = 'cessation-activité'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const { t } = useTranslation()

	const externalLinks = [
		{
			url: 'https://www.urssaf.fr/accueil/services/services-independants/cessation-activite.html',
			title: t(
				'pages.simulateurs.cessation-activité.externalLinks.1.title',
				'Le service Cessation d’activité'
			),
			description: t(
				'pages.simulateurs.cessation-activité.externalLinks.1.description',
				'L’Urssaf vous accompagne à toutes les étapes clés de votre démarche de cessation d’activité.'
			),
			logo: URSSAF,
			ctaLabel: t('external-links.service.ctaLabel', 'Accéder au service'),
			ariaLabel: t(
				'external-links.service.ariaLabel',
				'Accéder au service sur urssaf.fr, nouvelle fenêtre'
			),
		},
	]

	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

	const filteredSituation = omit(situation, 'entreprise . date de cessation')
	const basePath = useSimulatorsData().indépendant
		.path as MergedSimulatorDataValues['path']
	const lien = useUrl({ path: basePath, situation: filteredSituation })

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation
					customSimulationbutton={{
						href: lien,
						title: t('Vos cotisations pour l’année précédente'),
					}}
				>
					<SimulateurWarning
						simulateur={id}
						informationsComplémentaires={
							<Trans i18nKey="pages.simulateurs.cessation-activité.warning">
								<Body>
									Vous êtes travailleur indépendant ou travailleuse indépendante
									et vous souhaitez estimer les cotisations dues avant de cesser
									votre activité. Ce simulateur est là pour vous aider. À noter
									que le montant indiqué par ce simulateur est une estimation.
									Seul le «&nbsp;décompte réel de l'Urssaf&nbsp;» vous permettra
									de connaître le montant exact.{' '}
								</Body>
								<Body>
									<strong>Ce simulateur ne tient pas compte</strong> des
									versements déjà effectués, des cotisations provisionnelles
									déjà appelées, ni des éventuelles dettes.
								</Body>
							</Trans>
						}
					/>
					<CessationActivitéGoals />
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
