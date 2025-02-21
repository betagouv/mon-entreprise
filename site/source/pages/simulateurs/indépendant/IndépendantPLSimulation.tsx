import { Trans } from 'react-i18next'

import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { DarkLi, Ul } from '@/design-system/typography/list'
import useYear from '@/hooks/useYear'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const IndépendantPLSimulation = () => {
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
							<DarkLi>
								<Trans i18nKey="pages.simulateurs.profession-libérale.warning.général">
									Ce simulateur est à destination des professions libérales en
									BNC. Il ne prend pas en compte les sociétés d’exercice
									libéral.
								</Trans>
							</DarkLi>
							<DarkLi>
								<Trans i18nKey="pages.simulateurs.profession-libérale.warning.année-courante">
									Le montant calculé correspond aux cotisations de l’année{' '}
									{{ year }} (pour un revenu {{ year }}).
								</Trans>
							</DarkLi>{' '}
							<DarkLi>
								<Trans i18nKey="pages.simulateurs.profession-libérale.warning.cotisations-ordinales">
									Pour les professions réglementées, le simulateur ne calcule
									pas le montant des cotisations à l’ordre. Elles doivent être
									ajoutées manuellement dans la case « charges de fonctionnement
									».
								</Trans>
							</DarkLi>
						</Ul>
					}
				/>
				<IndépendantSimulationGoals legend="Vos revenus de profession libérale" />
			</Simulation>
		</>
	)
}
