import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import SalaryExplanation from 'Components/simulationExplanation/SalaryExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'

export function SASUSimulation() {
	return (
		<>
			<SimulateurWarning simulateur="sasu" />
			<Simulation explanations={<SalaryExplanation />}>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend="Vos revenus de dirigeant de SASU"
				>
					<SimulationGoal dottedName="dirigeant . rémunération . totale" />
					<SimulationGoal
						editable={false}
						small
						dottedName="contrat salarié . cotisations"
					/>
					<SimulationGoal dottedName="contrat salarié . rémunération . net" />
					<SimulationGoal small editable={false} dottedName="impôt . montant" />
					<SimulationGoal dottedName="contrat salarié . rémunération . net après impôt" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}
