import { useLayoutEffect } from 'react'
import { styled } from 'styled-components'

import { Situation } from '@/domaine/Situation'
import {
	GroupeDeQuestionsPublicodes,
	QuestionPublicodes,
} from '@/hooks/useQuestionsPublicodesEditorialisees'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { useTracking } from '@/hooks/useTracking'

import { type ConseillersEntreprisesVariant } from '../ConseillersEntreprises/BoutonConseillersEntreprises'
import { ACCUEIL, SIMULATION_COMMENCEE } from '../PianoAnalytics'
import SimulateurWarning from '../SimulateurWarning'
import { Actions } from './Actions'
import { ÉLÉMENT_DÉTAILS_ID } from './BoutonDétail'
import {
	ComposantQuestionFournie,
	GroupeDeQuestionsFournies,
} from './ComposantQuestionFournie'
import { ZoneDeSaisie } from './ZoneDeSaisie'

type Props<S extends Situation> = {
	id: SimulateurId
	montantsÀSaisir: React.ReactNode
	questionsPublicodesPrincipales?: QuestionPublicodes[]
	groupesDeQuestionsPublicodes?: Record<string, GroupeDeQuestionsPublicodes>
	questionsFourniesPrincipales?: ComposantQuestionFournie<S>[]
	groupesDeQuestionsFournies?: Record<string, GroupeDeQuestionsFournies<S>>
	situation?: S
	situationMinimaleSaisie?: boolean
	onReset?: () => void
	avertissement?: React.ReactNode
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
	simulationEstCommencée: boolean
	détail?: React.ReactNode
}

export const Simulateur = <S extends Situation = Situation>({
	id,
	montantsÀSaisir,
	questionsPublicodesPrincipales,
	groupesDeQuestionsPublicodes,
	questionsFourniesPrincipales,
	groupesDeQuestionsFournies,
	situation,
	situationMinimaleSaisie,
	onReset,
	avertissement,
	conseillersEntreprisesVariant,
	simulationEstCommencée,
	détail,
}: Props<S>) => {
	const { trackPage } = useTracking()

	useLayoutEffect(() => {
		trackPage({ name: simulationEstCommencée ? SIMULATION_COMMENCEE : ACCUEIL })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [simulationEstCommencée])

	return (
		<Container>
			<SimulateurWarning
				simulateur={id}
				informationsComplémentaires={avertissement}
			/>

			{/* Année précédente */}

			<ZoneDeSaisie
				questionsPublicodesPrincipales={questionsPublicodesPrincipales}
				groupesDeQuestionsPublicodes={groupesDeQuestionsPublicodes}
				questionsFourniesPrincipales={questionsFourniesPrincipales}
				groupesDeQuestionsFournies={groupesDeQuestionsFournies}
				situation={situation}
				situationMinimaleSaisie={situationMinimaleSaisie}
				onReset={onReset}
				montants={montantsÀSaisir}
			/>

			<Actions
				conseillersEntreprisesVariant={conseillersEntreprisesVariant}
				afficherBoutonVersDétail={!!détail}
				situationMinimaleSaisie={situationMinimaleSaisie}
			/>

			{détail && (
				<div id={ÉLÉMENT_DÉTAILS_ID} tabIndex={-1}>
					{détail}
				</div>
			)}
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.lg};
`
