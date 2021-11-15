import { Grid } from '@mui/material'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback'
import ShareOrSaveSimulationBanner from 'Components/ShareSimulationBanner'
import Progress from 'Components/ui/Progress'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import { Body } from 'DesignSystem/typography/paragraphs'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import { TrackPage } from '../ATInternetTracking'
import ExportRecover from './simulationExplanation/ExportRecover'
import { FromTop } from './ui/animate'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	children?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
}

export default function Simulation({
	explanations,
	results,
	children,
	customEndMessages,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)

	return (
		<>
			<ExportRecover />
			{children}

			{!firstStepCompleted && <TrackPage name="accueil" />}
			{firstStepCompleted && (
				<FromTop>
					<>
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
					</>
				</FromTop>
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
		<Grid container className="print-hidden">
			<Grid
				item
				xs={12}
				md={10}
				css={`
					margin: auto;
				`}
			>
				{progress < 1 && (
					<Body as="h2">
						<small>
							<Trans i18nKey="simulateurs.précision.défaut">
								Améliorez votre simulation en répondant aux questions
							</Trans>
						</small>
					</Body>
				)}

				<Conversation customEndMessages={customEndMessages} />
			</Grid>
			{progress < 1 && <Progress progress={progress} />}
		</Grid>
	)
}
