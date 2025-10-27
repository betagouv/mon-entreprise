import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { DarkLi, Ul } from '@/design-system'

import ComparaisonTable from './ComparaisonTable'

declare global {
	interface Window {
		STONLY_WID: string
		StonlyWidget?: {
			open: () => void
			close: () => void
			toggle: () => void
			launcherShow: () => void
			launcherHide: () => void
			startURLWatcher: () => void
			stopURLWatcher: () => void
		}
	}
}

export default function ActivitéPartielle() {
	const { t } = useTranslation()

	return (
		<Simulation
			results={
				<Condition expression="salarié . contrat . salaire brut >= salarié . contrat . temps de travail . SMIC">
					<ComparaisonTable />
				</Condition>
			}
			customEndMessages={
				<span>
					{t(
						'pages.simulateurs.activité-partielle.end-message',
						'Voir les résultats au-dessus'
					)}
				</span>
			}
		>
			<SimulateurWarning
				simulateur="activité-partielle"
				informationsComplémentaires={
					<Ul>
						<DarkLi>
							{t(
								'pages.simulateurs.activité-partielle.warning.1',
								'Ce simulateur ne prend pas en compte les rémunérations brutes définies sur 39h hebdomadaires.'
							)}
						</DarkLi>
						<DarkLi>
							{t(
								'pages.simulateurs.activité-partielle.warning.2',
								'De même, il ne prend pas en compte les indemnités complémentaire d’activité partielle prévue par une convention/accord collectif ou une décision unilatérale de l’employeur.'
							)}
						</DarkLi>
					</Ul>
				}
			/>
			<SimulationGoals>
				<SimulationGoal
					label={t(
						'pages.simulateurs.activité-partielle.salaire-brut',
						'Salaire brut mensuel'
					)}
					dottedName="salarié . contrat . salaire brut"
				/>
			</SimulationGoals>
		</Simulation>
	)
}
