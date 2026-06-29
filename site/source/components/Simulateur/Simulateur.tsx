import { useLayoutEffect } from 'react'
import { styled } from 'styled-components'

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
import { AutoScrollToQuestionsProvider } from './AutoScrollToQuestions'
import { ÉLÉMENT_DÉTAILS_ID } from './BoutonDétail'
import { ZoneDeSaisie } from './ZoneDeSaisie'

type Props = {
	id: SimulateurId
	montantsÀSaisir: React.ReactNode
	questionsPublicodesPrincipales: QuestionPublicodes[]
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes>
	avertissement?: React.ReactNode
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
	simulationEstCommencée: boolean
	détail?: React.ReactNode
}

export const Simulateur = ({
	id,
	montantsÀSaisir,
	questionsPublicodesPrincipales,
	groupesDeQuestionsPublicodes,
	avertissement,
	conseillersEntreprisesVariant,
	simulationEstCommencée,
	détail,
}: Props) => {
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

			<AutoScrollToQuestionsProvider>
				<ZoneDeSaisie
					questionsPublicodesPrincipales={questionsPublicodesPrincipales}
					groupesDeQuestionsPublicodes={groupesDeQuestionsPublicodes}
					montants={montantsÀSaisir}
				/>
			</AutoScrollToQuestionsProvider>

			<Actions
				conseillersEntreprisesVariant={conseillersEntreprisesVariant}
				afficherBoutonVersDétail={!!détail}
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
