import { setSimulationConfig } from 'Actions/actions'
import Controls from 'Components/Controls'
import Conversation, {
	ConversationProps
} from 'Components/conversation/Conversation'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
import PageFeedback from 'Components/Feedback/PageFeedback'
import SearchButton from 'Components/SearchButton'
import TargetSelection from 'Components/TargetSelection'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import React, { useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { SimulationConfig } from 'Reducers/rootReducer'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import * as Animate from 'Components/ui/animate'
import Progress from 'Components/ui/Progress'

type SimulationProps = {
	config: SimulationConfig
	explanations?: React.ReactNode
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
}

export default function Simulation({
	config,
	explanations,
	results,
	customEndMessages,
	showPeriodSwitch
}: SimulationProps) {
	const dispatch = useDispatch()
	const location = useLocation<{ fromGérer?: boolean }>()
	useEffect(() => {
		dispatch(setSimulationConfig(config, location.state?.fromGérer))
	}, [config])
	const firstStepCompleted = useSelector(firstStepCompletedSelector)
	const progress = useSimulationProgress()
	return (
		<>
			<TargetSelection showPeriodSwitch={showPeriodSwitch} />
			<SearchButton invisibleButton />
			{firstStepCompleted && (
				<>
					<Animate.fromTop>
						{results}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '1.2rem',
								marginBottom: '0.6rem',
								alignItems: 'baseline'
							}}
						>
							{progress < 1 ? (
								<small css="padding: 0.4rem 0">
									<Trans i18nKey="simulateurs.précision.défaut">
										Affinez la simulation en répondant aux questions :
									</Trans>
								</small>
							) : (
								<span />
							)}
							<SeeAnswersButton />
						</div>
						<section className="ui__ full-width lighter-bg">
							<div className="ui__ container">
								<Controls />
								<Conversation customEndMessages={customEndMessages} />
							</div>
						</section>
						{progress < 1 && (
							<Progress progress={progress} className="ui__ full-width" />
						)}
						<br />
						<PageFeedback
							customMessage={
								<Trans i18nKey="feedback.simulator">
									Êtes-vous satisfait de ce simulateur ?
								</Trans>
							}
							customEventName="rate simulator"
						/>{' '}
						{explanations}
					</Animate.fromTop>
				</>
			)}
		</>
	)
}
