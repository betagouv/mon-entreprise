import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { loadPreviousSimulation } from '@/actions/actions'
import { Link } from '@/design-system/typography/link'
import { RootState } from '@/reducers/rootReducer'
import { firstStepCompletedSelector } from '@/selectors/simulationSelectors'

import Banner from './Banner'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = useSelector(firstStepCompletedSelector)
	const dispatch = useDispatch()

	return (
		<Banner
			className="print-hidden"
			hidden={!previousSimulation || newSimulationStarted}
			icon="💾"
		>
			<Trans i18nKey="previousSimulationBanner.info">
				Votre précédente simulation a été sauvegardée :
			</Trans>{' '}
			<Link onPress={() => dispatch(loadPreviousSimulation())}>
				<Trans i18nKey="previousSimulationBanner.retrieveButton">
					Retrouver ma simulation
				</Trans>
			</Link>
		</Banner>
	)
}
