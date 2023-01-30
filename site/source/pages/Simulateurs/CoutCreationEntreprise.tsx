import { Condition } from '@/components/EngineValue'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'

export const CoutCreationEntreprise = () => {
	return (
		<>
			<Simulation
				showQuestionsFromBeginning
				explanations={
					<Condition expression="entreprise . coût formalités . création > 0">
						<H3>Détails</H3>
						<Grid container>
							<Grid item xl={6} lg={8} sm={10}>
								<SimulationGoal
									dottedName="entreprise . coût formalités . RCS . création"
									editable={false}
									small
									round={false}
								/>
								<SimulationGoal
									dottedName="entreprise . coût formalités . CMA . création"
									editable={false}
									small
									round={false}
								/>
								<SimulationGoal
									dottedName="entreprise . coût formalités . RSAC . création"
									editable={false}
									small
									round={false}
								/>
								<SimulationGoal
									dottedName="entreprise . coût formalités . JAL . forfaitaire"
									editable={false}
									small
									round={false}
								/>
							</Grid>
						</Grid>
					</Condition>
				}
			>
				<SimulationGoals legend="Simulateur du coût de création d'une entreprise">
					<SimulationGoal
						dottedName="entreprise . coût formalités . création"
						editable={false}
						round={false}
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}
