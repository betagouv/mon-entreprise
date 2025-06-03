import Navigation from '../components/Navigation'
import Ressources from '../components/informations-générales/Ressources'

export default function InformationsGénérales() {
	return (
		<>
			<Ressources />

			<Navigation précédent="index" suivant="enfants" />
		</>
	)
}
