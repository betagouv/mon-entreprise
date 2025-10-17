import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AvertissementRéformeAssietteNonImplémentée from '@/components/AvertissementRéformeAssietteNonImplémentée'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Body } from '@/design-system'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useUrl } from '@/hooks/useUrl'
import { CessationActivitéGoals } from '@/pages/simulateurs/cessation-activité/Goals'
import { companySituationSelector } from '@/store/selectors/companySituation.selector'
import { situationSelector } from '@/store/selectors/simulationSelectors'
import { omit } from '@/utils'

export const CessationActivitéSimulation = () => {
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}

	const filteredSituation = omit(situation, 'entreprise . date de cessation')
	const path = useSimulatorsData().indépendant
		.path as Partial<MergedSimulatorDataValues>
	const lien = useUrl({ path, situation: filteredSituation })

	const { t } = useTranslation()

	return (
		<Simulation
			customSimulationbutton={{
				href: lien,
				title: t('Vos cotisations pour l’année précédente'),
			}}
		>
			<SimulateurWarning
				simulateur="cessation-activité"
				informationsComplémentaires={
					<>
						<AvertissementRéformeAssietteNonImplémentée />
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
								versements déjà effectués, des cotisations provisionnelles déjà
								appelées, ni des éventuelles dettes.
							</Body>
						</Trans>
					</>
				}
			/>
			<CessationActivitéGoals />
		</Simulation>
	)
}
