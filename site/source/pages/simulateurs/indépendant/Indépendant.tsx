import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import AvertissementRéformeAssietteNonImplémentée from '@/components/AvertissementRéformeAssietteNonImplémentée'
import RuleInput from '@/components/conversation/RuleInput'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { Body } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import useYear from '@/hooks/useYear'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'
import { ajusteLaSituation } from '@/store/actions/actions'

export default function IndépendantSimulation() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const year = useYear()
	const { currentSimulatorData } = useCurrentSimulatorData()
	const WarningComponent = currentSimulatorData?.warning

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<YearSelectionBanner />}
			>
				<SimulateurWarning
					simulateur="indépendant"
					informationsComplémentaires={
						<>
							<AvertissementRéformeAssietteNonImplémentée />
							{WarningComponent && <WarningComponent />}
							<Body>
								{t(
									'pages.simulateurs.indépendant.warning.année-courante',
									'Le montant calculé correspond aux cotisations de l’année {{ year }} (pour un revenu {{ year }}).',
									{ year }
								)}
							</Body>
						</>
					}
				/>
				<IndépendantSimulationGoals
					toggles={
						<>
							<RuleInput
								inputType="toggle"
								hideDefaultValue
								missing={false}
								dottedName="entreprise . imposition"
								onChange={(imposition) => {
									dispatch(
										ajusteLaSituation({
											'entreprise . imposition': imposition,
										} as Record<DottedName, ValeurPublicodes>)
									)
								}}
							/>
						</>
					}
				/>
			</Simulation>
		</>
	)
}
