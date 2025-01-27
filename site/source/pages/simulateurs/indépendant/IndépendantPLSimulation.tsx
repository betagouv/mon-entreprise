import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import useYear from '@/components/utils/useYear'
import { Li, Ul } from '@/design-system/typography/list'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export default function IndépendantPLSimulation() {
	const year = useYear()

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning
					simulateur="profession-libérale"
					informationsComplémentaires={
						<Ul>
							<StyledLi>
								<Trans i18nKey="simulateurs.warning.profession-libérale">
									Ce simulateur est à destination des professions libérales en
									BNC. Il ne prend pas en compte les sociétés d’exercice
									libéral.
								</Trans>
							</StyledLi>
							<StyledLi>
								<Trans i18nKey="simulateurs.warning.libérale.année-courante">
									Le montant calculé correspond aux cotisations de l’année{' '}
									{{ year }} (pour un revenu {{ year }}).
								</Trans>
							</StyledLi>{' '}
							<StyledLi>
								<Trans i18nKey="simulateurs.warning.cotisations-ordinales">
									Pour les professions réglementées, le simulateur ne calcule
									pas le montant des cotisations à l’ordre. Elles doivent être
									ajoutées manuellement dans la case « charges de fonctionnement
									».
								</Trans>
							</StyledLi>
						</Ul>
					}
				/>
				<IndépendantSimulationGoals legend="Vos revenus de profession libérale" />
			</Simulation>
		</>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`
