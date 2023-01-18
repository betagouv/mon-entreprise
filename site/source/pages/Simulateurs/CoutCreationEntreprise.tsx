import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'

export const CoutCreationEntreprise = () => {
	return (
		<>
			{/* <Conversation engines={[engine]} /> */}
			<Simulation showQuestionsFromBeginning>
				{/* <SimulateurWarning simulateur="sasu" /> */}
				<SimulationGoals
					// toggles={<PeriodSwitch />}
					legend=""
				>
					{/* <SimulationGoal dottedName="dirigeant . rémunération . totale" />
					<SimulationGoal
						editable={false}
						small
						dottedName="dirigeant . assimilé salarié . cotisations"
					/>
					<SimulationGoal dottedName="salarié . rémunération . net . à payer avant impôt" />
					<SimulationGoal small editable={false} dottedName="impôt . montant" /> */}
					{/* <SimulationGoal dottedName="coût création entreprise" /> */}
					{/* <SimulationGoal dottedName="entreprise . activité . nature" /> */}
					{/* <SimulationGoal dottedName="entreprise . activités . service ou vente" /> */}
					<SimulationGoal
						dottedName="entreprise . catégorie juridique"
						editable={false}
					/>
					<SimulationGoal
						dottedName="entreprise . activité . nature"
						editable={false}
					/>
					<SimulationGoal
						dottedName="entreprise . coût formalités . création"
						editable={false}
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}
