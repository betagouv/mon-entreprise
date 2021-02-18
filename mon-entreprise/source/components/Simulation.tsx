import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback/PageFeedback'
import SearchButton from 'Components/SearchButton'
import ShareSimulationBanner from 'Components/ShareSimulationBanner'
import TargetSelection from 'Components/TargetSelection'
import * as Animate from 'Components/ui/animate'
import Progress from 'Components/ui/Progress'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import { TrackPage } from '../ATInternetTracking'
import SeeAnswersButton from './conversation/SeeAnswersButton'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	children?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
}

export default function Simulation({
	explanations,
	results,
	children,
	customEndMessages,
	showPeriodSwitch,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)

	const simulationBloc = children ?? (
		<TargetSelection showPeriodSwitch={showPeriodSwitch} />
	)
	return (
		<>
			{simulationBloc}
			<SearchButton invisibleButton />
			{!firstStepCompleted && <TrackPage name="accueil" />}
			{firstStepCompleted && (
				<>
					<Animate.fromTop>
						{results}
						<ShareSimulationBanner />
						<Questions customEndMessages={customEndMessages} />
						<br />
						<PageFeedback
							customMessage={
								<Trans i18nKey="feedback.simulator">
									Êtes-vous satisfait de ce simulateur ?
								</Trans>
							}
							customEventName="rate simulator"
						/>
						{explanations}
					</Animate.fromTop>
				</>
			)}
		</>
	)
}

export function Questions({
	customEndMessages,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
}) {
	const progress = useSimulationProgress()

	return (
		<>
			<section className="ui__ full-width lighter-bg">
				<div className="ui__ container">
					<div
						css={`
							display: flex;
							flex-wrap: wrap;
							justify-content: center;
							align-items: baseline;
						`}
					>
						{progress < 1 && (
							<h2
								css={`
									font-family: 'roboto';
									font-weight: normal;
									flex: 1;
									font-size: 1.1rem;
									margin-top: 0;
								`}
							>
								<small>
									<Trans i18nKey="simulateurs.précision.défaut">
										Améliorez votre simulation en répondant aux questions
									</Trans>
								</small>
							</h2>
						)}
						<SeeAnswersButton />
					</div>

					<Conversation customEndMessages={customEndMessages} />
				</div>
			</section>
			{progress < 1 && (
				<Progress progress={progress} className="ui__ full-width" />
			)}
		</>
	)
}
