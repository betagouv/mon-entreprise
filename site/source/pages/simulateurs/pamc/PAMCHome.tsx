import { TrackPage } from '@/components/ATInternetTracking'
import { H2 } from '@/design-system/typography/heading'
import useSimulatorsData from '@/hooks/useSimulatorsData'

import { SimulateurCard } from '../../simulateurs-et-assistants'

export default function SalariéSimulation() {
	const simulators = useSimulatorsData()

	return (
		<>
			<TrackPage chapter1="simulateurs" name="accueil_pamc" />
			<H2>Quelle profession exercez-vous ?</H2>
			<div role="list">
				<SimulateurCard
					small
					{...simulators['auxiliaire-médical']}
					role="listitem"
				/>
				<SimulateurCard
					small
					{...simulators['chirurgien-dentiste']}
					role="listitem"
				/>
				<SimulateurCard small {...simulators.médecin} role="listitem" />
				<SimulateurCard small {...simulators['sage-femme']} role="listitem" />
			</div>
		</>
	)
}
