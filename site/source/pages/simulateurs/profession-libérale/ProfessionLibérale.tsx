import { Trans } from 'react-i18next'

import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { DarkLi, Ul } from '@/design-system'
import useYear from '@/hooks/useYear'
import ExplicationsIndépendant from '@/pages/simulateurs/indépendant/components/Explications'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export default function ProfessionLibérale() {
	const year = useYear()

	return (
		<>
			<Simulation
				explanations={<ExplicationsIndépendant />}
				afterQuestionsSlot={<YearSelectionBanner />}
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
				<IndépendantSimulationGoals />
			</Simulation>
		</>
	)
}
