import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { DarkLi, Ul } from '@/design-system'
import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { SimulateurId } from '@/hooks/useSimulatorsMetadata'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import ComparaisonTable from './ComparaisonTable'
import { activitéPartielleMetadata } from './metadata'
import { activitéPartielleOpenGraph } from './opengraph'
import { SeoExplanations } from './SeoExplanations'
import { configActivitéPartielle } from './simulationConfig'

const nextSteps = ['salarié'] satisfies SimulateurId[]

const externalLinks = [
	serviceEmployeur,
	embaucherGérerSalariés,
	nouvelEmployeur,
]

export function ActivitéPartielle() {
	const metadata = usePageMetadata(activitéPartielleMetadata)
	const { isReady, engine, questions, raccourcis } = useSimulationPublicodes(
		metadata,
		configActivitéPartielle
	)

	const { t } = useTranslation()

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				metadata={metadata}
				openGraph={activitéPartielleOpenGraph(t)}
				seoExplanations={<SeoExplanations />}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					conseillersEntreprisesVariant="activite_partielle"
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
						simulateur={metadata.id}
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
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
