import { Grid } from '@mui/material'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback'
import ShareOrSaveSimulationBanner from 'Components/ShareSimulationBanner'
import Progress from 'Components/ui/Progress'
import { Spacing } from 'DesignSystem/layout'
import { Body } from 'DesignSystem/typography/paragraphs'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import { TrackPage } from '../ATInternetTracking'
import PreviousSimulationBanner from './PreviousSimulationBanner'
import ExportRecover from './simulationExplanation/ExportRecover'
import { FadeIn, FromTop } from './ui/animate'
import { useSimulationProgress } from './utils/useNextQuestion'

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
			{!firstStepCompleted && <TrackPage name="accueil" />}
			<ExportRecover />
			<Spacing xxl />
			<Grid container spacing={2}>
				<Grid item sm={12} md={10}>
					{children}
					{!firstStepCompleted && <PreviousSimulationBanner />}

					{firstStepCompleted && (
						<FromTop>
							<Spacing lg />
							{results}
							<ShareOrSaveSimulationBanner />
							<Questions customEndMessages={customEndMessages} />
							<Spacing lg />
							{explanations}
						</FromTop>
					)}
				</Grid>
				<Grid item sm={12} md={2}>
					{firstStepCompleted && (
						<>
							<Spacing lg />
							<div
								css={`
									margin-right: -2rem;
									position: sticky;
									top: 0;
								`}
								className=" print-display-none"
							>
								<FadeIn>
									<PageFeedback
										customMessage={
											<Trans i18nKey="feedback.simulator">
												Êtes-vous satisfait de ce simulateur&nbsp;?
											</Trans>
										}
									/>
								</FadeIn>
							</div>
						</>
					)}
				</Grid>
			</Grid>
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
		<div className="print-hidden">
			{progress < 1 && (
				<Body as="h2">
					<Trans i18nKey="simulateurs.précision.défaut">
						Améliorez votre simulation en répondant aux questions :
					</Trans>
				</Body>
			)}

			<Conversation customEndMessages={customEndMessages} />
			{progress < 1 && <Progress progress={progress} />}
		</div>
	)
}
