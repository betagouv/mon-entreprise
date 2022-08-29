import { H2 } from '@/design-system/typography/heading'
import { TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from './Home'
import useSimulatorsData from './metadata'

export default function SalariéSimulation() {
	const simulators = useSimulatorsData()
	console.log(simulators)

	return (
		<>
			<TrackPage chapter1="simulateurs" name="accueil_pamc" />
			<H2>Quelle profession exercez-vous ?</H2>
			<div className="ui__ small box-container">
				<SimulateurCard small {...simulators['auxiliaire-médical']} />
				<SimulateurCard small {...simulators['chirurgien-dentiste']} />
				<SimulateurCard small {...simulators.médecin} />
				<SimulateurCard small {...simulators['sage-femme']} />
			</div>
		</>
	)
}
