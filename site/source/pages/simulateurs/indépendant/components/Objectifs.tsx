import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

export const ObjectifsIndépendant = ({
	toggles,
}: {
	toggles?: React.ReactNode
}) => (
	<SimulationGoals toggles={toggles}>
		<PeriodSwitch />

		<Condition expression="entreprise . imposition = 'IR'">
			<ObjectifsIR />
		</Condition>

		<Condition expression="entreprise . imposition = 'IS'">
			<ObjectifsIS />
		</Condition>

		<SimulationGoal dottedName="indépendant . rémunération . nette" />

		<SimulationGoal
			small
			editable={false}
			dottedName="indépendant . rémunération . impôt"
		/>

		<SimulationGoal dottedName="indépendant . rémunération . nette . après impôt" />
	</SimulationGoals>
)

const ObjectifsIR = () => (
	<>
		<Condition expression="entreprise . imposition . IR . régime micro-fiscal = non">
			<SimulationGoal
				appear={false}
				dottedName="entreprise . chiffre d'affaires"
			/>
		</Condition>

		<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
			<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
		</Condition>

		<Condition expression="entreprise . imposition . IR . régime micro-fiscal != oui">
			<SimulationGoal appear={false} dottedName="entreprise . charges" />
		</Condition>

		<SimulationGoal
			small
			editable={false}
			dottedName="indépendant . cotisations et contributions"
		/>

		<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
			<SimulationGoal appear={false} dottedName="entreprise . charges" />
		</Condition>
	</>
)

const ObjectifsIS = () => (
	<>
		<SimulationGoal
			appear={false}
			dottedName="indépendant . rémunération . totale"
		/>

		<SimulationGoal
			small
			editable={false}
			dottedName="indépendant . cotisations et contributions"
		/>
	</>
)
