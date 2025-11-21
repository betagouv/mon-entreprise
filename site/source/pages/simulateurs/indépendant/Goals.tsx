import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

export const IndépendantSimulationGoals = ({
	toggles,
}: {
	toggles?: React.ReactNode
}) => (
	<SimulationGoals toggles={toggles}>
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
				dottedName="indépendant . rémunération . totale"
			/>
		</Condition>

		<SimulationGoal
			small
			editable={false}
			dottedName="indépendant . cotisations et contributions"
		/>
		<Condition expression="entreprise . imposition . régime . micro-entreprise">
			<SimulationGoal appear={false} dottedName="entreprise . charges" />
		</Condition>
		<SimulationGoal dottedName="indépendant . rémunération . nette" />
		<Condition expression="impôt . montant > 0">
			<SimulationGoal small editable={false} dottedName="impôt . montant" />
		</Condition>
		<SimulationGoal dottedName="indépendant . rémunération . nette . après impôt" />
	</SimulationGoals>
)
