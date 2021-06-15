import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'

export default function ÉquivalentSalaireTJM() {
	return (
		<>
			<SimulateurWarning simulateur="équivalent-salaire-tjm" />
			<Simulation>
				<SimulationGoals className="plain">
					<SimulationGoal dottedName="contrat salarié . rémunération . brut de base" />
					<SimulationGoal
						editable={false}
						dottedName="salaire tjm . équivalent . tarif journalier auto-entrepreneur"
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}
