import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import { ConversationProps } from '@/components/conversation/Conversation'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import { PopoverWithTrigger } from '@/design-system'
import { Grid, Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import {
	companySituationSelector,
	firstStepCompletedSelector,
} from '@/store/selectors/simulationSelectors'

import { TrackPage } from '../ATInternetTracking'
import Banner from '../Banner'
import AnswerList from '../conversation/AnswerList'
import { Feedback, getShouldAskFeedback } from '../Feedback/Feedback'
import PrintExportRecover from '../simulationExplanation/PrintExportRecover'
import PreviousSimulationBanner from './../PreviousSimulationBanner'
import { FromTop } from './../ui/animate'
import EntrepriseSelection from './EntrepriseSelection'
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
	showQuestionsFromBeginning?: boolean
	customEndMessages?: ConversationProps['customEndMessages']
	fullWidth?: boolean
	id?: string
}

const StyledGrid = styled(Grid)`
	width: 100%;
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
	showQuestionsFromBeginning,
	hideDetails = false,
	fullWidth,
	id,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)
	const existingCompany = !!useSelector(companySituationSelector)[
		'entreprise . SIREN'
	]
	const shouldShowFeedback = getShouldAskFeedback(useLocation().pathname)

	const { t } = useTranslation()

	return (
		<>
			{!firstStepCompleted && <TrackPage name="accueil" />}

			<SimulationContainer fullWidth={fullWidth} id={id}>
				<PrintExportRecover />
				{children}
				<FromTop>
					{(firstStepCompleted || showQuestionsFromBeginning) && (
						<>
							<EntrepriseSelection />
							<div className="print-hidden">
								<FromTop>{results}</FromTop>
							</div>
							<Questions customEndMessages={customEndMessages} />
						</>
					)}
					<Spacing md />

					{!showQuestionsFromBeginning && !firstStepCompleted && (
						<PreviousSimulationBanner />
					)}
					{afterQuestionsSlot}
					{existingCompany && (
						<Banner icon="✏">
							<Trans>
								Ce simulateur a été prérempli avec la situation de votre
								entreprise.
							</Trans>{' '}
							<PopoverWithTrigger
								trigger={(buttonProps) => (
									<Link
										{...buttonProps}
										aria-haspopup="dialog"
										aria-label={t(
											'Voir ma situation, accéder à la page de gestion de mon entreprise'
										)}
									>
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
							<ShareOrSaveSimulationBanner share print conseillersEntreprises />
							<Spacing lg />
						</>
					)}
				</FromTop>
			</SimulationContainer>
			{firstStepCompleted && !hideDetails && explanations}
			{firstStepCompleted && !hideDetails && shouldShowFeedback && (
				<div
					style={{
						textAlign: 'center',
						padding: '1rem',
						paddingBottom: '2rem',
					}}
				>
					<Feedback />
				</div>
			)}
		</>
	)
}

export function SimulationContainer({
	children,
	fullWidth = false,
	id,
}: {
	children: React.ReactNode
	fullWidth?: boolean
	id?: string
}) {
	return (
		<Grid
			container
			spacing={2}
			style={{
				justifyContent: 'center',
			}}
			id={id}
		>
			<StyledGrid
				item
				style={
					fullWidth
						? {
								width: ' 100%',
								maxWidth: 'none',
								flexBasis: 'auto',
						  }
						: {}
				}
				xl={9}
				lg={10}
				md={11}
				sm={12}
			>
				{children}
			</StyledGrid>
		</Grid>
	)
}
