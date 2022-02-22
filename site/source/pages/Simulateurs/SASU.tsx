import PeriodSwitch from '~/components/PeriodSwitch'
import SimulateurWarning from '~/components/SimulateurWarning'
import Simulation from '~/components/Simulation'
import SalaryExplanation from '~/components/simulationExplanation/SalaryExplanation'
import { SimulationGoal, SimulationGoals } from '~/components/Simulation'

export function SASUSimulation() {
	return (
		<>
			<Simulation explanations={<SalaryExplanation />}>
				<SimulateurWarning simulateur="sasu" />
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
