import { RaisonInéligibilité, useCMG } from '@/contextes/cmg'

import AMA from '../components/AMA/AMA'
import GED from '../components/GED/GED'
import Navigation from '../components/Navigation'
import NonÉligible from './NonÉligible'

export default function Déclarations() {
	const { raisonsInéligibilité } = useCMG()
	const raisonsInéligibilitéValables: Array<RaisonInéligibilité> = [
		'ressources',
		'enfants-à-charge',
	]

	if (
		raisonsInéligibilitéValables.some((raison) =>
			raisonsInéligibilité.includes(raison)
		)
	) {
		return <NonÉligible précédent="enfants" />
	}

	return (
		<>
			<AMA />
			<GED />

			<Navigation précédent="enfants" suivant="résultat" />
		</>
	)
}
