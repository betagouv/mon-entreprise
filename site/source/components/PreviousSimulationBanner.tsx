import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from '@/design-system/typography/link'
import { loadPreviousSimulation } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { firstStepCompletedSelector } from '@/store/selectors/simulationSelectors'

import Banner from './Banner'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = useSelector(firstStepCompletedSelector)
	const dispatch = useDispatch()

	const { t } = useTranslation()

	return (
		<Banner
			className="print-hidden"
			hidden={!previousSimulation || newSimulationStarted}
			icon="💾"
		>
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
		</Banner>
	)
}
