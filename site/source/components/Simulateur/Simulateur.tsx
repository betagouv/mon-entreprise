import { useLayoutEffect } from 'react'
import { styled } from 'styled-components'

import { Situation } from '@/domaine/Situation'
import { GroupeDeQuestionsPublicodes } from '@/hooks/useQuestionsPublicodesEditorialisees'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { useTracking } from '@/hooks/useTracking'

import { type ConseillersEntreprisesVariant } from '../ConseillersEntreprises/BoutonConseillersEntreprises'
import { ACCUEIL, SIMULATION_COMMENCEE } from '../PianoAnalytics'
import SimulateurWarning from '../SimulateurWarning'
import { Actions } from './Actions'
import { ZoneDeSaisie } from './ZoneDeSaisie'

type Props<S extends Situation = Situation> = {
	id: SimulateurId
	montantsÀSaisir: React.ReactNode
	groupesDeQuestionsPublicodes: Record<string, GroupeDeQuestionsPublicodes<S>>
	avertissement?: React.ReactNode
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
	simulationEstCommencée: boolean
	détail?: React.ReactNode
}

export const Simulateur = ({
	id,
	montantsÀSaisir,
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

			<ZoneDeSaisie
				groupesDeQuestionsPublicodes={groupesDeQuestionsPublicodes}
				montants={montantsÀSaisir}
			/>

			<Actions
				conseillersEntreprisesVariant={conseillersEntreprisesVariant}
				afficherBoutonVersDétail={!!détail}
			/>

			{détail && <div id="simulation-détail">{détail}</div>}
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.lg};
`
