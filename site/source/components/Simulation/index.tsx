import { ConversationProps } from '@/components/conversation/Conversation'
import PageFeedback from '@/components/Feedback'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import { Message, PopoverWithTrigger } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import {
	companySituationSelector,
	firstStepCompletedSelector,
} from '@/selectors/simulationSelectors'
import { Grid, styled } from '@mui/material'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { TrackPage } from '../../ATInternetTracking'
import Banner from '../Banner'
import AnswerList from '../conversation/AnswerList'
import PreviousSimulationBanner from './../PreviousSimulationBanner'
import ExportRecover from './../simulationExplanation/ExportRecover'
import { FadeIn, FromTop } from './../ui/animate'
import { Questions } from './Questions'

export { Questions } from './Questions'
export { SimulationGoal } from './SimulationGoal'
export { SimulationGoals } from './SimulationGoals'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	children?: React.ReactNode
	afterQuestionsSlot?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
}

const StyledGrid = styled(Grid)`
	@media print {
		max-width: initial;
		flex-basis: initial;
		flex-grow: 1;
		margin: 0 1rem;
	}
`

export default function Simulation({
	explanations,
	results,
	children,
	afterQuestionsSlot,
	customEndMessages,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)
	const existingCompany = !!useSelector(companySituationSelector)[
		'entreprise . SIREN'
	]
	return (
		<>
			{!firstStepCompleted && <TrackPage name="accueil" />}
			<ExportRecover />
			<Grid container spacing={2} justifyContent="center">
				<StyledGrid item xl={9} lg={10} md={11} sm={12}>
					{children}

					<div className="print-hidden">
						{!firstStepCompleted && (
							<>
								<Spacing sm />
								<PreviousSimulationBanner />
								{afterQuestionsSlot}
							</>
						)}

						{firstStepCompleted && (
							<FromTop>
								{results}
								<Questions customEndMessages={customEndMessages} />
								<Spacing sm />
								{afterQuestionsSlot}
							</FromTop>
						)}
						{existingCompany && (
							<Banner icon="✏">
								Ce simulateur a été prérempli avec la situation de votre
								entreprise.{' '}
								<PopoverWithTrigger
									trigger={(buttonProps) => (
										<Link {...buttonProps}>
											<Trans>Voir ma situation</Trans>
										</Link>
									)}
								>
									{(close) => <AnswerList onClose={close} />}
								</PopoverWithTrigger>
							</Banner>
						)}
						{firstStepCompleted && (
							<>
								<ShareOrSaveSimulationBanner />
								<Spacing lg />
							</>
						)}
					</div>
				</StyledGrid>
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
