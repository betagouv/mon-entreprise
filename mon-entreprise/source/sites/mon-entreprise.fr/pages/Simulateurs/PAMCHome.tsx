import { default as React } from 'react'
import { SimulateurCard } from './Home'
import useSimulatorsData from './metadata'

export default function SalariéSimulation() {
	const simulators = useSimulatorsData()
	return (
		<>
			<h2>Quelle profession exercez-vous ?</h2>
			<div className="ui__ small box-container">
				<SimulateurCard small {...simulators['auxiliaire-médical']} />
				<SimulateurCard small {...simulators['chirurgien-dentiste']} />
				<SimulateurCard small {...simulators.médecin} />
				<SimulateurCard small {...simulators['sage-femme']} />
			</div>
		</>
	)
}
