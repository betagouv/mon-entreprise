import { useNavigate } from 'react-router-dom'

import { TrackPage } from '@/components/ATInternetTracking'
import {
	estEnfantsÀChargeValide,
	estInformationsValides,
	estModesDeGardeValide,
	RaisonInéligibilité,
	useCMG,
} from '@/contextes/cmg'

import AMA from '../components/AMA/AMA'
import GED from '../components/GED/GED'
import Navigation from '../components/Navigation'

export default function Déclarations() {
	const navigate = useNavigate()
	const { raisonsInéligibilité, situation } = useCMG()

	if (
		!estInformationsValides(situation) ||
		!estEnfantsÀChargeValide(situation.enfantsÀCharge)
	) {
		navigate('/assistants/cmg')
	}

	const raisonsInéligibilitéValables: Array<RaisonInéligibilité> = [
		'ressources',
		'enfants-à-charge',
	]
	if (
		raisonsInéligibilitéValables.some((raison) =>
			raisonsInéligibilité.includes(raison)
		)
	) {
		navigate('/assistants/cmg/inéligible', { state: { précédent: 'enfants' } })
	}

	const isSuivantDisabled = !estModesDeGardeValide(situation.modesDeGarde)

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
