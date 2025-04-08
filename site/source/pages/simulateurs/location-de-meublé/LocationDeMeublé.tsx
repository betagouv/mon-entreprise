import { DottedName } from 'modele-social'
import { useCallback, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'

import AvertissementDansObjectifDeSimulateur from '@/components/AvertissementDansObjectifDeSimulateur'
import { InputProps } from '@/components/conversation/RuleInput'
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
import { setRecettesNumber } from '@/store/slices/locationDeMeubleSlice'
import { activeLocationDeMeuble } from '@/store/slices/simulateursSlice'

import { ObjectifCotisations } from './ObjectifCotisations'
import { ObjectifRevenuNet } from './ObjectifRevenuNet'

export default function LocationDeMeublé() {
	const engine = useEngine()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(activeLocationDeMeuble())
	}, [dispatch])

	const handlePublicodeRecettesChange = useCallback(
		(_name: DottedName, ...values: Parameters<InputProps['onChange']>) => {
			if (typeof values[0] === 'object' && 'valeur' in values[0]) {
				dispatch(setRecettesNumber(Number(values[0].valeur)))
			}
		},
		[dispatch]
	)

	return (
		<Simulation entrepriseSelection={false}>
			<SimulateurWarning simulateur="location-de-logement-meublé" />
			<SimulationGoals legend="Montant de votre loyer net">
				<SimulationGoal
					dottedName="location de logement meublé . courte durée . recettes"
					displayedUnit="€/an"
					onUpdateSituation={handlePublicodeRecettesChange}
				/>

				<WhenNotApplicable
					dottedName="location de logement meublé . cotisations"
					engine={engine}
				>
					<AvertissementDansObjectifDeSimulateur>
						<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.avertissement.dépassement-du-plafond">
							Vous dépassez le plafond autorisé (
							<Value
								linkToRule={false}
								expression="location de logement meublé . plafond régime général"
							/>
							) pour déclarer vos revenus de l'économie collaborative avec un
							statut social au régime général. Vous devez vous orienter vers les
							statuts d'auto-entrepreneur ou de travailleur indépendant.
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
								et votre activité n'est pas considérée comme professionnelle.
								Vous n'êtes pas obligé de vous affilier à la sécurité sociale.
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

					<ObjectifCotisations />

					<SimulationValue
						isInfoMode
						dottedName="location de logement meublé . revenu net"
					/>

					<ObjectifRevenuNet />
				</WhenApplicable>
			</SimulationGoals>
		</Simulation>
	)
}
