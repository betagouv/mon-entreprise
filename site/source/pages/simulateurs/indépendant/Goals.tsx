import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

export const IndépendantSimulationGoals = ({
	toggles,
	legend,
}: {
	toggles?: React.ReactNode
	legend: string
}) => (
	<SimulationGoals toggles={toggles} legend={legend}>
		<PeriodSwitch />
		<Condition expression="entreprise . imposition = 'IR'">
			<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
				<SimulationGoal
					appear={false}
					dottedName="entreprise . chiffre d'affaires"
				/>
			</Condition>
			<Condition expression="entreprise . imposition . régime . micro-entreprise">
				<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
			</Condition>
			<Condition expression="entreprise . imposition . régime . micro-entreprise != oui">
				<SimulationGoal appear={false} dottedName="entreprise . charges" />
			</Condition>
		</Condition>
		<Condition expression="entreprise . imposition = 'IS'">
			<SimulationGoal
				appear={false}
				dottedName="dirigeant . rémunération . totale"
			/>
		</Condition>

		<SimulationGoal
			small
			editable={false}
			dottedName="dirigeant . indépendant . cotisations et contributions"
		/>
		<Condition expression="entreprise . imposition . régime . micro-entreprise">
			<SimulationGoal appear={false} dottedName="entreprise . charges" />
		</Condition>
		<SimulationGoal dottedName="dirigeant . rémunération . net" />
		<Condition expression="impôt . montant > 0">
			<SimulationGoal small editable={false} dottedName="impôt . montant" />
		</Condition>
		<SimulationGoal dottedName="dirigeant . rémunération . net . après impôt" />
	</SimulationGoals>
)
