import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'
import { updateSituation } from '@/store/actions/actions'

export default function IndépendantSimulation() {
	const dispatch = useDispatch()

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="indépendant" />
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
										updateSituation('entreprise . imposition', imposition)
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
