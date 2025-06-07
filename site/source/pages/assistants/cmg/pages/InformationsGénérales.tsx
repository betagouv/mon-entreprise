import CMGPerçu from '../components/informations-générales/CMGPerçu'
import NombreMoisDéclarationsSuffisant from '../components/informations-générales/NombreMoisDéclarationsSuffisant'
import Ressources from '../components/informations-générales/Ressources'
import SituationFamiliale from '../components/informations-générales/SituationFamiliale'
import Navigation from '../components/Navigation'

export default function InformationsGénérales() {
	return (
		<>
			<NombreMoisDéclarationsSuffisant />
			<CMGPerçu />
			<SituationFamiliale />
			<Ressources />

			<Navigation précédent="index" suivant="enfants" />
		</>
	)
}
