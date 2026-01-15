import { useTranslation } from 'react-i18next'

import AvertissementRéformeAssietteNonImplémentée from '@/components/AvertissementRéformeAssietteNonImplémentée'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { DarkLi, Ul } from '@/design-system'
import useYear from '@/hooks/useYear'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const IndépendantPLSimulation = () => {
	const year = useYear()
	const { t } = useTranslation()

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<YearSelectionBanner />}
			>
				<SimulateurWarning
					simulateur="profession-libérale"
					informationsComplémentaires={
						<>
							<AvertissementRéformeAssietteNonImplémentée />
							<Ul>
								<DarkLi>
									{t(
										'pages.simulateurs.profession-libérale.warning.général',
										'Ce simulateur est à destination des professions libérales en BNC. Il ne prend pas en compte les sociétés d’exercice libéral.'
									)}
								</DarkLi>
								<DarkLi>
									{t(
										'pages.simulateurs.indépendant.warning.année-courante',
										'Le montant calculé correspond aux cotisations de l’année {{ year }} (pour un revenu {{ year }}).',
										{ year }
									)}
								</DarkLi>{' '}
								<DarkLi>
									{t(
										'pages.simulateurs.profession-libérale.warning.cotisations-ordinales',
										'Pour les professions réglementées, le simulateur ne calcule pas le montant des cotisations à l’ordre. Elles doivent être ajoutées manuellement dans la case « charges de fonctionnement ».'
									)}
								</DarkLi>
							</Ul>
						</>
					}
				/>
				<IndépendantSimulationGoals />
			</Simulation>
		</>
	)
}
