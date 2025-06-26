import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import SimulationBanner from '@/components/Simulation/Banner'
import { Link } from '@/design-system/typography/link'
import { loadPreviousSimulation } from '@/store/actions/actions'
import { previousSimulationSelector } from '@/store/selectors/simulationSelectors'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(previousSimulationSelector)
	const dispatch = useDispatch()
	const { t } = useTranslation()

	if (!previousSimulation) {
		return null
	}

	return (
		<SimulationBanner className="print-hidden" icon="💾">
			<Trans i18nKey="previousSimulationBanner.info">
				Votre précédente simulation a été sauvegardée :
			</Trans>{' '}
			<Link
				onPress={() => dispatch(loadPreviousSimulation())}
				aria-label={t(
					'Retrouver ma précédente simulation, charger les données de ma précédente simulation.'
				)}
				role="button"
			>
				<Trans i18nKey="previousSimulationBanner.retrieveButton">
					Retrouver ma précédente simulation
				</Trans>
			</Link>
		</SimulationBanner>
	)
}
