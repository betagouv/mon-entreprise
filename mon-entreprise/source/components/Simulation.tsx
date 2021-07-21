import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback'
import ShareOrSaveSimulationBanner from 'Components/ShareSimulationBanner'
import ObjectifSelection from 'Components/ObjectifSelection'
import Progress from 'Components/ui/Progress'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import { TrackPage } from '../ATInternetTracking'
import SeeAnswersButton from './conversation/SeeAnswersButton'
import ExportRecover from './simulationExplanation/ExportRecover'
import { FromTop } from './ui/animate'

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
		<ObjectifSelection showPeriodSwitch={showPeriodSwitch} />
	)
	return (
		<>
			<ExportRecover />
			{simulationBloc}

			{!firstStepCompleted && <TrackPage name="accueil" />}
			{firstStepCompleted && (
				<>
					<FromTop>
						{results}
						<ShareOrSaveSimulationBanner />
						<Questions customEndMessages={customEndMessages} />
						<div className="ui__ full-width">
							<div className="ui__ container-and-side-block">
								{explanations && (
									<>
										<div
											css={`
												flex: 1;
											`}
										/>
										<div
											className="ui__ container"
											css={`
												flex-shrink: 0;
											`}
										>
											{explanations}
										</div>
									</>
								)}
								<div
									className="ui__ side-block print-display-none"
									css={!explanations ? 'justify-content: center;' : ''}
								>
									<div
										css={`
											margin: 1rem;
										`}
									>
										<div className="ui__ card lighter-bg">
											<PageFeedback
												customMessage={
													<Trans i18nKey="feedback.simulator">
														Êtes-vous satisfait de ce simulateur&nbsp;?
													</Trans>
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</FromTop>
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
		<div className="ui__ print-display-none">
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
									font-size: 1.1rem !important;
									margin-top: 0 !important;
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
		</div>
	)
}
