import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SmallBody } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { QuestionPublicodes } from '@/hooks/useQuestionsPublicodesEditorialisees'
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
	questionsPublicodes: QuestionPublicodes<S>[]
	avertissement?: React.ReactNode
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
	simulationEstCommencée: boolean
	détail?: React.ReactNode
}

export const Simulateur = ({
	id,
	montantsÀSaisir,
	questionsPublicodes,
	avertissement,
	conseillersEntreprisesVariant,
	simulationEstCommencée,
	détail,
}: Props) => {
	const { trackPage } = useTracking()
	const { t } = useTranslation()

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
				questionsPublicodes={questionsPublicodes}
				montants={montantsÀSaisir}
			/>

			<Actions
				conseillersEntreprisesVariant={conseillersEntreprisesVariant}
				afficherBoutonVersDétail={!!détail}
			/>

			{détail ? (
				<div id="simulation-détail">{détail}</div>
			) : (
				<SmallBody>
					{t(
						'components.simulateur.résultats.indisponibles',
						'Entrez un montant pour afficher les résultats détaillés.'
					)}
				</SmallBody>
			)}
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.lg};
`
