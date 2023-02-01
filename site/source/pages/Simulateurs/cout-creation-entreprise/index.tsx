import { Condition } from '@/components/EngineValue'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'

export default function CoutCreationEntreprise() {
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
									displayedUnit="€ HT"
									dottedName="entreprise . coût formalités . RCS . création"
									label="Frais d'inscription au registre du commerce et des sociétés"
									editable={false}
									small
									round={false}
								/>
								<SimulationGoal
									displayedUnit="€ HT"
									dottedName="entreprise . coût formalités . CMA . création"
									label="Frais d'inscription à la chambre des Métiers et de l'Artisanat"
									editable={false}
									small
									round={false}
								/>
								<SimulationGoal
									displayedUnit="€ HT"
									dottedName="entreprise . coût formalités . RSAC . création"
									label="Frais d'inscription au registre spécial des agents commerciaux"
									editable={false}
									small
									round={false}
								/>
								<SimulationGoal
									displayedUnit="€ HT"
									dottedName="entreprise . coût formalités . annonce légale . forfaitaire"
									label="Frais d'annonce légale"
									editable={false}
									small
									round={false}
								/>
							</Grid>
						</Grid>
					</Condition>
				}
			>
				<SimulateurWarning simulateur="coût-création-entreprise" />
				<SimulationGoals legend="Simulateur du coût de création d'une entreprise">
					<SimulationGoal
						displayedUnit="€ HT"
						dottedName="entreprise . coût formalités . création"
						editable={false}
						round={false}
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}
