import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { Body } from '@/design-system'
import { getSearchParamsFromSituation } from '@/hooks/useSearchParamsSimulationSharing'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSiteUrl } from '@/hooks/useSiteUrl'
import { CessationActivitéGoals } from '@/pages/simulateurs/cessation-activité/Goals'
import {
	companySituationSelector,
	situationSelector,
	targetUnitSelector,
} from '@/store/selectors/simulationSelectors'
import { omit } from '@/utils'

export const CessationActivitéSimulation = () => {
	const situation = {
		...useSelector(situationSelector),
		...useSelector(companySituationSelector),
	}
	const targetUnit = useSelector(targetUnitSelector)
	const filteredSituation = omit(situation, 'entreprise . date de cessation')

	const searchParams = getSearchParamsFromSituation(
		filteredSituation,
		targetUnit
	)

	const path = useSimulatorsData().indépendant.path

	const lien = useSiteUrl() + path + '?' + searchParams.toString()

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
						<Body>
							Vous êtes travailleur indépendant, vous souhaitez estimer les
							cotisations dues avant de cesser votre activité. Ce simulateur est
							là pour vous aider. A noter que le montant indiqué par ce
							simulateur est une estimation. Seule le "décompte réel de
							l'Urssaf" vous permettra de connaitre le montant exact.{' '}
						</Body>
						<Body>
							<strong>Ce simulateur ne tient pas compte</strong> des versements
							déjà effectués et des cotisations provisionnelles déjà appelées
							ainsi que des éventuelles dettes
						</Body>
					</>
				}
			/>
			<CessationActivitéGoals />
		</Simulation>
	)
}
