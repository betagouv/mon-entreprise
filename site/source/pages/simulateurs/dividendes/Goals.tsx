import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

import { OptionBarèmeSwitch } from './components/OptionBarèmeSwitch'

export const DividendesSimulationGoals = () => (
	<SimulationGoals toggles={<OptionBarèmeSwitch />}>
		<Condition expression="entreprise . imposition = 'IS'">
			<SimulationGoal
				appear={false}
				dottedName="bénéficiaire . dividendes . bruts"
			/>

			<Condition expression="impôt . méthode de calcul . barème standard">
				<SimulationGoal
					small
					appear={false}
					dottedName="impôt . foyer fiscal . revenu imposable . autres revenus imposables"
				/>
			</Condition>
			<SimulationGoal
				appear={false}
				dottedName="bénéficiaire . dividendes . nets d'impôt"
			/>
		</Condition>
	</SimulationGoals>
)
