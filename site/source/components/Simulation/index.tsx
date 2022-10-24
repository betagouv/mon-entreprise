import { ConversationProps } from '@/components/conversation/Conversation'
import PageFeedback from '@/components/Feedback'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import { PopoverWithTrigger } from '@/design-system'
import { Grid, Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import {
	companySituationSelector,
	firstStepCompletedSelector,
} from '@/selectors/simulationSelectors'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import Banner from '../Banner'
import AnswerList from '../conversation/AnswerList'
import PrintExportRecover from '../simulationExplanation/PrintExportRecover'
import PreviousSimulationBanner from './../PreviousSimulationBanner'
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
	hideDetails?: boolean
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
	hideDetails = false,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)
	const existingCompany = !!useSelector(companySituationSelector)[
		'entreprise . SIREN'
	]
	const { t } = useTranslation()

	return (
		<>
			{!firstStepCompleted && <TrackPage name="accueil" />}
			<Grid
				container
				spacing={2}
				css={`
					justify-content: center;
				`}
			>
				<StyledGrid item xl={9} lg={10} md={11} sm={12}>
					<PrintExportRecover />
					{children}
					<FromTop>
						<div className="print-hidden">
							{!firstStepCompleted && (
								<>
									<Spacing sm />
									<PreviousSimulationBanner />
								</>
							)}
						</div>
						{firstStepCompleted && (
							<>
								<div className="print-hidden">
									<FromTop>{results}</FromTop>
								</div>
								<Questions customEndMessages={customEndMessages} />
							</>
						)}
						<div className="print-hidden">
							{afterQuestionsSlot}
							{existingCompany && (
								<Banner icon="✏">
									Ce simulateur a été prérempli avec la situation de votre
									entreprise.{' '}
									<PopoverWithTrigger
										trigger={(buttonProps) => (
											<Link {...buttonProps} aria-haspopup="dialog">
												<Trans>Voir ma situation</Trans>
											</Link>
										)}
									>
										{(close) => <AnswerList onClose={close} />}
									</PopoverWithTrigger>
								</Banner>
							)}
							{firstStepCompleted && !hideDetails && (
								<>
									<ShareOrSaveSimulationBanner
										share
										print
										placeDesEntreprises
									/>
									<Spacing lg />
								</>
							)}
						</div>
					</FromTop>
				</StyledGrid>
			</Grid>
			{firstStepCompleted && !hideDetails && (
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
