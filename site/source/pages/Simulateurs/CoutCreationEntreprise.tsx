import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'

export const CoutCreationEntreprise = () => {
	return (
		<>
			<Simulation showQuestionsFromBeginning>
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
