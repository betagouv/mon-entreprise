import Ressources from '../components/informations-générales/Ressources'
import Navigation from '../components/Navigation'

export default function InformationsGénérales() {
	return (
		<>
			<Ressources />

			<Navigation précédent="index" suivant="enfants" />
		</>
	)
}
