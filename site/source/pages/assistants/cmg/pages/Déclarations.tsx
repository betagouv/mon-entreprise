import { TrackPage } from '@/components/ATInternetTracking'
import {
	estModesDeGardeValide,
	RaisonInéligibilité,
	useCMG,
} from '@/contextes/cmg'

import AMA from '../components/AMA/AMA'
import GED from '../components/GED/GED'
import Navigation from '../components/Navigation'
import NonÉligible from './NonÉligible'

export default function Déclarations() {
	const { raisonsInéligibilité, situation } = useCMG()
	const raisonsInéligibilitéValables: Array<RaisonInéligibilité> = [
		'ressources',
		'enfants-à-charge',
	]

	const isSuivantDisabled = !estModesDeGardeValide(situation.modesDeGarde)

	if (
		raisonsInéligibilitéValables.some((raison) =>
			raisonsInéligibilité.includes(raison)
		)
	) {
		return <NonÉligible précédent="enfants" />
	}

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="déclarations" />

			<AMA />
			<GED />

			<Navigation
				précédent="enfants"
				suivant="résultat"
				isSuivantDisabled={isSuivantDisabled}
			/>
		</>
	)
}
