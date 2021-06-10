import { loadPreviousSimulation } from 'Actions/actions'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { LinkButton } from 'Components/ui/Button'
import Banner from './Banner'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = useSelector(firstStepCompletedSelector)
	const dispatch = useDispatch()

	return (
		<div className="print-display-none">
			<Banner hidden={!previousSimulation || newSimulationStarted} icon="💾">
				<Trans i18nKey="previousSimulationBanner.info">
					Votre précédente simulation a été sauvegardée :
				</Trans>{' '}
				<LinkButton onClick={() => dispatch(loadPreviousSimulation())}>
					<Trans i18nKey="previousSimulationBanner.retrieveButton">
						Retrouver ma simulation
					</Trans>
				</LinkButton>
			</Banner>
		</div>
	)
}
