import { Option } from 'effect'
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { type ConseillersEntreprisesVariant } from '@/components/ConseillersEntreprises/BoutonConseillersEntreprises'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { Grid, Spacing } from '@/design-system'
import { RaccourciPublicodes } from '@/domaine/RaccourciPublicodes'
import { Situation } from '@/domaine/Situation'
import { QuestionPublicodes } from '@/hooks/useQuestions'
import { useNavigation } from '@/lib/navigation'
import { Action } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { firstStepCompletedSelector } from '@/store/selectors/simulation/firstStepCompleted.selector'

import { Feedback } from '../Feedback/Feedback'
import { shouldAskFeedback } from '../Feedback/utils'
import { ACCUEIL, SIMULATION_COMMENCEE, TrackPage } from '../PianoAnalytics'
import PrintExportRecover from '../simulationExplanation/PrintExportRecover'
import { FromTop } from './../ui/animate'
import EntrepriseSelection from './EntrepriseSelection'
import PreviousSimulationBanner from './PreviousSimulationBanner'
import { Questions } from './Questions'
import SimulationPréremplieBanner from './SimulationPréremplieBanner'

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
	customSimulationButton?: React.ReactNode
	avecSimulationPrécédente?: boolean
	hideDetails?: boolean
	showQuestionsFromBeginning?: boolean
	customEndMessages?: ReactNode
	fullWidth?: boolean
	id?: string
	entrepriseSelection?: boolean
	simulationEstCommencée?: (situation?: S) => boolean
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant

	situation?: S
	questions?: Array<ComposantQuestion<S>>
	questionsPublicodes?: Array<QuestionPublicodes<S>>
	raccourcisPublicodes?: Array<RaccourciPublicodes>
}

export default function Simulation<S extends Situation = Situation>({
	explanations,
	results,
	children,
	afterQuestionsSlot,
	customSimulationButton,
	avecSimulationPrécédente = true,
	customEndMessages,
	showQuestionsFromBeginning,
	hideDetails = false,
	fullWidth,
	id,
	entrepriseSelection = true,
	simulationEstCommencée,
	conseillersEntreprisesVariant,
	situation,
	questions,
	questionsPublicodes,
	raccourcisPublicodes,
}: SimulationProps<S>) {
	const isFirstStepCompleted = useSelector(firstStepCompletedSelector)
	const laSimulationEstCommencée = simulationEstCommencée
		? simulationEstCommencée(situation)
		: isFirstStepCompleted
	const { currentPath } = useNavigation()
	const shouldShowFeedback = shouldAskFeedback(currentPath)
	const showQuestions = showQuestionsFromBeginning || laSimulationEstCommencée

	return (
		<>
			{!laSimulationEstCommencée && <TrackPage name={ACCUEIL} />}
			{laSimulationEstCommencée && <TrackPage name={SIMULATION_COMMENCEE} />}

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

							<Questions
								situation={situation}
								questions={questions}
								questionsPublicodes={questionsPublicodes}
								raccourcisPublicodes={raccourcisPublicodes}
								customEndMessages={customEndMessages}
								showModifierMesRéponses={!!questionsPublicodes?.length}
							/>
						</>
					)}
					<Spacing md />

					{!entrepriseSelection && !!questionsPublicodes?.length && (
						<SimulationPréremplieBanner />
					)}

					{avecSimulationPrécédente &&
						!showQuestions &&
						!!questionsPublicodes?.length && <PreviousSimulationBanner />}

					{afterQuestionsSlot}

					{laSimulationEstCommencée && !hideDetails && (
						<>
							{customSimulationButton}

							<ShareOrSaveSimulationBanner
								share
								print
								conseillersEntreprisesVariant={conseillersEntreprisesVariant}
							/>
							<Spacing lg />
						</>
					)}
				</FromTop>
			</SimulationContainer>
			{laSimulationEstCommencée && !hideDetails && explanations}
			{laSimulationEstCommencée && !hideDetails && shouldShowFeedback && (
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
