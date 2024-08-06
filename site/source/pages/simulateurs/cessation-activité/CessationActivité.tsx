import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { useParamsFromSituation } from '@/components/utils/useSearchParamsSimulationSharing'
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
	const filteredSituation = omit(situation, 'entreprise . date de radiation')

	const searchParams = useParamsFromSituation(filteredSituation, targetUnit)

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
				informationsComplémentaires={<>Warning</>}
			/>
			<CessationActivitéGoals />
		</Simulation>
	)
}
