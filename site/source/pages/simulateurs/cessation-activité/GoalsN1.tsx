import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

export const CessationActivitéGoalsN1 = () => {
	return (
		<SimulationGoals legend="Vos revenus d’activité pour l’année N-1">
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
					<SimulationGoal
						small
						appear={false}
						dottedName="entreprise . charges"
					/>
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
				label={"Total des cotisations à devoir après cessation d'activité"}
			/>
			<Condition expression="entreprise . imposition . régime . micro-entreprise">
				<SimulationGoal
					small
					appear={false}
					dottedName="entreprise . charges"
				/>
			</Condition>
		</SimulationGoals>
	)
}
