import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback'
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
import ExportSimulationBanner from 'Components/ExportSimulationBanner'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	children?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
	userWillExport:()=>void
	disableAnimation: boolean
}

export default function Simulation({
	explanations,
	results,
	children,
	customEndMessages,
	showPeriodSwitch,
	userWillExport,
	disableAnimation,
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
						<ExportSimulationBanner userWillExport={userWillExport} disableAnimation={disableAnimation}/>
						<Questions customEndMessages={customEndMessages} />
						<br />
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
											margin: 0 1rem;
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
		<div className='print-display-none'>
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
