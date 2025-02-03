import { Trans, useTranslation } from 'react-i18next'

import AvertissementDansObjectifDeSimulateur from '@/components/AvertissementDansObjectifDeSimulateur'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { useEngine } from '@/components/utils/EngineContext'

export default function LocationDeMeublé() {
	const engine = useEngine()
	const { t } = useTranslation()

	return (
		<Simulation entrepriseSelection={false}>
			<SimulateurWarning simulateur="location-de-logement-meublé" />
			<SimulationGoals legend="Montant de votre loyer net">
				<SimulationGoal
					dottedName="location de logement . meublé . loyer . net"
					displayedUnit="€/an"
				/>

				<WhenNotApplicable
					dottedName="location de logement . meublé . cotisations"
					engine={engine}
				>
					<AvertissementDansObjectifDeSimulateur>
						<Trans>
							Vous dépassez le plafond autorisé (
							<Value expression="location de logement . meublé . plafond de loyer autorisé pour le régime général" />
							) pour déclarer vos revenus de l’économie collaborative avec un
							statut social au régime général. Vous devez vous orienter vers les
							statuts d’autoentrepreneur ou de travailleur indépendant.
						</Trans>
						{t('')}
					</AvertissementDansObjectifDeSimulateur>
				</WhenNotApplicable>
				<WhenApplicable
					dottedName="location de logement . meublé . cotisations"
					engine={engine}
				>
					<SimulationGoal
						dottedName="location de logement . meublé . cotisations"
						small
					/>
				</WhenApplicable>
			</SimulationGoals>
		</Simulation>
	)
}
