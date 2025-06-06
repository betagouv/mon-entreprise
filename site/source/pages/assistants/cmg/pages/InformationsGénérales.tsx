import Ressources from '../components/informations-générales/Ressources'
import SituationFamiliale from '../components/informations-générales/SituationFamiliale'
import Navigation from '../components/Navigation'

export default function InformationsGénérales() {
	return (
		<>
			<SituationFamiliale />
			<Ressources />

			<Navigation précédent="index" suivant="enfants" />
		</>
	)
}
