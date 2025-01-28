import { DottedName } from 'modele-social'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import useYear from '@/components/utils/useYear'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'
import { ajusteLaSituation } from '@/store/actions/actions'

export default function IndépendantSimulation() {
	const dispatch = useDispatch()
	const year = useYear()

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning
					simulateur="indépendant"
					informationsComplémentaires={
						<Body>
							<Trans i18nKey="simulateurs.warning.indépendant.année-courante">
								Le montant calculé correspond aux cotisations de l’année{' '}
								{{ year }} (pour un revenu {{ year }}).
							</Trans>
						</Body>
					}
				/>
				<IndépendantSimulationGoals
					legend="Vos revenus d'indépendant"
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
										} as Record<DottedName, SimpleRuleEvaluation>)
									)
								}}
							/>
							<PeriodSwitch />
						</>
					}
				/>
			</Simulation>
		</>
	)
}
