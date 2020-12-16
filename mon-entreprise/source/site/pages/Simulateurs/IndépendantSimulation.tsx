import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import IndépendantExplanation from 'Components/simulationExplanation/IndépendantExplanation'
export default function IndépendantSimulation() {
	return (
		<>
			<SimulateurWarning simulateur="indépendant" />
			<Simulation explanations={<IndépendantExplanation />} />
		</>
	)
}
export function IndépendantPLSimulation() {
	return (
		<>
			<SimulateurWarning simulateur="profession-libérale" />
			<Simulation explanations={<IndépendantExplanation />} />
		</>
	)
}
