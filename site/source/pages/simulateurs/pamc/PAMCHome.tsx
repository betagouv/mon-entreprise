import { TrackPage } from '@/components/ATInternetTracking'
import { SimulateurCard } from '@/components/SimulateurCard'
import { H2 } from '@/design-system'
import useSimulatorsData from '@/hooks/useSimulatorsData'

export default function PAMCHome() {
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
