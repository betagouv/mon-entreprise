import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation/index'
import { DarkLi, Ul } from '@/design-system/index'
import { embaucherGérerSalariés } from '@/external-links/embaucherGererSalaries'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import ComparaisonTable from './ComparaisonTable'

const nextSteps = ['salarie'] satisfies SimulateurId[]

const externalLinks = [
	serviceEmployeur,
	embaucherGérerSalariés,
	nouvelEmployeur,
]

export function ActivitéPartielle() {
	const id = 'activite-partielle'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine, questions, raccourcis } =
		useSimulationPublicodes(simulateurConfig)

	const { t } = useTranslation()

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					results={
						<Condition expression="salarie . contrat . salaire brut >= salarie . contrat . temps de travail . SMIC">
							<ComparaisonTable />
						</Condition>
					}
					customEndMessages={
						<span>
							{t(
								'pages.simulateurs.activite-partielle.end-message',
								'Voir les résultats au-dessus'
							)}
						</span>
					}
				>
					<SimulateurWarning
						simulateur={id}
						informationsComplémentaires={
							<Ul>
								<DarkLi>
									{t(
										'pages.simulateurs.activite-partielle.warning.1',
										'Ce simulateur ne prend pas en compte les rémunérations brutes définies sur 39h hebdomadaires.'
									)}
								</DarkLi>
								<DarkLi>
									{t(
										'pages.simulateurs.activite-partielle.warning.2',
										'De même, il ne prend pas en compte les indemnités complémentaire d’activité partielle prévue par une convention/accord collectif ou une décision unilatérale de l’employeur.'
									)}
								</DarkLi>
							</Ul>
						}
					/>
					<SimulationGoals>
						<SimulationGoal
							label={t(
								'pages.simulateurs.activite-partielle.salaire-brut',
								'Salaire brut mensuel'
							)}
							dottedName="salarie . contrat . salaire brut"
						/>
					</SimulationGoals>
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
