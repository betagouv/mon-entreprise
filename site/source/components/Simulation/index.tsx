import { Grid } from '@mui/material'
import { ConversationProps } from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback'
import ShareOrSaveSimulationBanner from 'Components/ShareSimulationBanner'
import { Spacing } from 'DesignSystem/layout'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/simulationSelectors'
import { TrackPage } from '../../ATInternetTracking'
import PreviousSimulationBanner from './../PreviousSimulationBanner'
import ExportRecover from './../simulationExplanation/ExportRecover'
import { FadeIn, FromTop } from './../ui/animate'
import { Questions } from './Questions'

export { Questions } from './Questions'

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
			<Grid container spacing={2} justifyContent="center">
				<Grid item xl={9} lg={10}>
					{children}
					{!firstStepCompleted && <PreviousSimulationBanner />}

					{firstStepCompleted && (
						<FromTop>
							{results}
							<Questions customEndMessages={customEndMessages} />
							<Spacing sm />
							<ShareOrSaveSimulationBanner />
							<Spacing lg />
						</FromTop>
					)}
				</Grid>
			</Grid>
			{firstStepCompleted && (
				<>
					<div className="print-hidden">
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
					{explanations}
				</>
			)}
		</>
	)
}
