import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'

export default function LocationDeMeublé() {
	return (
		<Simulation>
			<SimulateurWarning simulateur="location-de-logement-meublé" />
			<SimulationGoals legend="Montant de votre loyer net">
				<SimulationGoal dottedName="location de logement . meublé . loyer . net" />
				<SimulationGoal
					dottedName="location de logement . meublé . cotisations"
					small
				/>
			</SimulationGoals>
		</Simulation>
	)
}
