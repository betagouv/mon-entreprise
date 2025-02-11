import { Trans } from 'react-i18next'

import AvertissementDansObjectifDeSimulateur from '@/components/AvertissementDansObjectifDeSimulateur'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { useEngine } from '@/components/utils/EngineContext'
import { SmallBody } from '@/design-system/typography/paragraphs'

export default function LocationDeMeublé() {
	const engine = useEngine()

	return (
		<Simulation entrepriseSelection={false}>
			<SimulateurWarning simulateur="location-de-logement-meublé" />
			<SimulationGoals legend="Montant de votre loyer net">
				<SimulationGoal
					dottedName="location de logement meublé . courte durée . recettes"
					displayedUnit="€/an"
				/>

				<WhenNotApplicable
					dottedName="location de logement meublé . cotisations"
					engine={engine}
				>
					<AvertissementDansObjectifDeSimulateur>
						<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.avertissement.dépassement-du-plafond">
							Vous dépassez le plafond autorisé (
							<Value expression="location de logement meublé . plafond régime général" />
							) pour déclarer vos revenus de l’économie collaborative avec un
							statut social au régime général. Vous devez vous orienter vers les
							statuts d’auto-entrepreneur ou de travailleur indépendant.
						</Trans>
					</AvertissementDansObjectifDeSimulateur>
				</WhenNotApplicable>
				<WhenApplicable
					dottedName="location de logement meublé . cotisations"
					engine={engine}
				>
					<Condition expression="location de logement meublé . cotisations = 0">
						<SmallBody>
							<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.avertissement.pas-de-cotisation">
								Le montant de vos recettes est inférieur à{' '}
								<Value expression="location de logement meublé . seuil de professionalisation" />{' '}
								€ et votre activité n’est pas considérée comme professionnelle.
								Vous n’êtes pas obligé de vous affilier à la sécurité sociale.
								Vous pouvez toutefois le faire si vous souhaitez bénéficier
								d'une protection sociale (assurance maladie, retraite…) en
								contrepartie du paiement des cotisations sociales.
							</Trans>
						</SmallBody>
					</Condition>
					<SimulationValue
						isInfoMode
						dottedName="location de logement meublé . cotisations"
					/>
					<SimulationValue
						isInfoMode
						dottedName="location de logement meublé . revenu net"
					/>
				</WhenApplicable>
			</SimulationGoals>
		</Simulation>
	)
}
