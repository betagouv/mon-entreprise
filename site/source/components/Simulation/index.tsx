import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import { ConversationProps } from '@/components/conversation/Conversation'
import ShareOrSaveSimulationBanner, {
	CustomSimulationButton,
} from '@/components/ShareSimulationBanner'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { firstStepCompletedSelector } from '@/store/selectors/simulationSelectors'

import { TrackPage } from '../ATInternetTracking'
import { Feedback, getShouldAskFeedback } from '../Feedback/Feedback'
import PrintExportRecover from '../simulationExplanation/PrintExportRecover'
import SimulationPréremplieBanner from '../SimulationPréremplieBanner'
import PreviousSimulationBanner from './../PreviousSimulationBanner'
import { FromTop } from './../ui/animate'
import EntrepriseSelection from './EntrepriseSelection'
import { Questions } from './Questions'

export { Questions } from './Questions'
export { SimulationGoal } from './SimulationGoal'
export { SimulationGoals } from './SimulationGoals'

const StyledGrid = styled(Grid)`
	width: 100%;
	@media print {
		max-width: initial;
		flex-basis: initial;
		flex-grow: 1;
		margin: 0 1rem;
	}
`

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
	customSimulationbutton?: CustomSimulationButton
}

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
	customSimulationbutton,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)
	const shouldShowFeedback = getShouldAskFeedback(useLocation().pathname)

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

					<SimulationPréremplieBanner />

					{!showQuestionsFromBeginning && !firstStepCompleted && (
						<PreviousSimulationBanner />
					)}

					{afterQuestionsSlot}

					{firstStepCompleted && !hideDetails && (
						<>
							{customSimulationbutton && (
								<>
									<div>
										<H3>
											Avez-vous besoin de calculer les cotisations de l'année
											précédente ?
										</H3>
										<Button size="MD" href={customSimulationbutton.href}>
											{customSimulationbutton.title}
										</Button>
									</div>
									<Spacing lg />
								</>
							)}

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
