import { Option } from 'effect'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'

import ShareOrSaveSimulationBanner, {
	CustomSimulationButton,
} from '@/components/ShareSimulationBanner'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Situation } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { Action } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { firstStepCompletedSelector } from '@/store/selectors/simulationSelectors'

import { TrackPage } from '../ATInternetTracking'
import { Feedback, getShouldAskFeedback } from '../Feedback/Feedback'
import PrintExportRecover from '../simulationExplanation/PrintExportRecover'
import { FromTop } from './../ui/animate'
import EntrepriseSelection from './EntrepriseSelection'
import PreviousSimulationBanner from './PreviousSimulationBanner'
import { QuestionFournie } from './QuestionFournie'
import { Questions } from './Questions'
import SimulationPréremplieBanner from './SimulationPréremplieBanner'

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

/**
 * Adaptateur pour connecter les questions à un store Redux
 * ou toute autre source de données et méthode de mise à jour
 *
 * @template S Type de la situation
 * @template A Type de l'action générée
 */
export interface SituationStoreAdapter<
	S extends Situation = Situation,
	A extends Action = Action,
> {
	/** Sélecteur pour obtenir la situation actuelle depuis le state global (Option) */
	selector: (state: RootState) => Option.Option<S>
	/** Fonction pour créer l'action de mise à jour de la situation */
	updateActionCreator: (situation: S) => A
}

/**
 * Props du composant Simulation
 *
 * @template S Type de la situation utilisée par les questions
 */
type SimulationProps<S extends Situation = Situation> = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	children?: React.ReactNode
	afterQuestionsSlot?: React.ReactNode
	hideDetails?: boolean
	showQuestionsFromBeginning?: boolean
	customEndMessages?: ReactNode
	fullWidth?: boolean
	id?: string
	customSimulationbutton?: CustomSimulationButton
	entrepriseSelection?: boolean

	// Nouvelles props pour les questions personnalisées
	/** Questions personnalisées à afficher */
	questions?: Array<QuestionFournie<S>>
	/** Adaptateur pour connecter les questions au store */
	situationAdapter?: SituationStoreAdapter<S>
	/** Afficher aussi les questions Publicodes générées automatiquement */
	avecQuestionsPublicodes?: boolean
}

export default function Simulation<S extends Situation = Situation>({
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
	entrepriseSelection = true,
	questions,
	situationAdapter,
	avecQuestionsPublicodes = true,
}: SimulationProps<S>) {
	const isFirstStepCompleted = useSelector(firstStepCompletedSelector)
	const shouldShowFeedback = getShouldAskFeedback(useLocation().pathname)
	const showQuestions = showQuestionsFromBeginning || isFirstStepCompleted

	return (
		<>
			{!isFirstStepCompleted && <TrackPage name="accueil" />}

			<SimulationContainer fullWidth={fullWidth} id={id}>
				<PrintExportRecover />
				{children}
				<FromTop>
					{showQuestions && (
						<>
							<div className="print-hidden">
								<FromTop>{results}</FromTop>
							</div>
							{entrepriseSelection && <EntrepriseSelection />}

							{/* Questions (personnalisées et/ou Publicodes) */}
							<Questions
								questions={questions}
								situationAdapter={situationAdapter}
								avecQuestionsPublicodes={avecQuestionsPublicodes}
								customEndMessages={customEndMessages}
							/>
						</>
					)}
					<Spacing md />

					{!entrepriseSelection && <SimulationPréremplieBanner />}

					{!showQuestions && <PreviousSimulationBanner />}

					{afterQuestionsSlot}

					{isFirstStepCompleted && !hideDetails && (
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
			{isFirstStepCompleted && !hideDetails && explanations}
			{isFirstStepCompleted && !hideDetails && shouldShowFeedback && (
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
