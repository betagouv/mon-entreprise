import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { SmallBody } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { QuestionPublicodes } from '@/hooks/useQuestionsPublicodesV2'
import { SimulateurId } from '@/hooks/useSimulatorsData'

import { ConseillersEntreprisesVariant } from '../ConseillersEntreprisesButton'
import SimulateurWarning from '../SimulateurWarning'
import { Actions } from './Actions'
import { ZoneDeSaisie } from './ZoneDeSaisie'

type Props<S extends Situation = Situation> = {
	id: SimulateurId
	montantsÀSaisir: React.ReactNode
	questionsPublicodes: QuestionPublicodes<S>[]
	avertissement?: React.ReactNode
	conseillersEntreprisesVariant?: ConseillersEntreprisesVariant
	détail?: React.ReactNode
}

export const Simulateur = ({
	id,
	montantsÀSaisir,
	questionsPublicodes,
	avertissement,
	conseillersEntreprisesVariant,
	détail,
}: Props) => {
	const laSimulationEstCommencée = simulationEstCommencée
		? simulationEstCommencée(situation)
		: true
	const { t } = useTranslation()

	return (
		<Container>
			{/* Tracking */}

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
