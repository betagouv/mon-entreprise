import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import SimulationBanner from '@/components/Simulation/Banner'
import { Link } from '@/design-system'
import { chargeLaSimulationPrécédente } from '@/store/actions/actions'
import { previousSimulationSelector } from '@/store/selectors/previousSimulation.selector'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(previousSimulationSelector)
	const dispatch = useDispatch()
	const { t } = useTranslation()

	if (!previousSimulation) {
		return null
	}

	return (
		<SimulationBanner className="print-hidden" icon="💾">
			{t(
				'pages.simulateurs.commun.previousSimulationBanner.titre',
				'Votre précédente simulation a été sauvegardée :'
			)}
			<Link
				onPress={() => dispatch(chargeLaSimulationPrécédente())}
				aria-label={t(
					'pages.simulateurs.commun.previousSimulationBanner.bouton.aria-label',
					'Retrouver ma précédente simulation, charger les données de ma précédente simulation.'
				)}
			>
				{t(
					'pages.simulateurs.commun.previousSimulationBanner.bouton.texte',
					'Retrouver ma précédente simulation'
				)}
			</Link>
		</SimulationBanner>
	)
}
