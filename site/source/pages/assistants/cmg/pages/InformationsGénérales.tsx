import { TrackPage } from '@/components/ATInternetTracking'
import { estInformationsValides, useCMG } from '@/contextes/cmg'

import QuestionCMGPerçu from '../components/informations-générales/QuestionCMGPerçu'
import QuestionNombreMoisDéclarationsSuffisant from '../components/informations-générales/QuestionNombreMoisDéclarationsSuffisant'
import QuestionRessources from '../components/informations-générales/QuestionRessources'
import QuestionSituationFamiliale from '../components/informations-générales/QuestionSituationFamiliale'
import Navigation from '../components/Navigation'

export default function InformationsGénérales() {
	const { situation } = useCMG()
	const isSuivantDisabled = !estInformationsValides(situation)

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name="informations" />

			<QuestionNombreMoisDéclarationsSuffisant />
			<QuestionCMGPerçu />
			<QuestionSituationFamiliale />
			<QuestionRessources />

			<Navigation
				précédent="index"
				suivant="enfants"
				isSuivantDisabled={isSuivantDisabled}
			/>
		</>
	)
}
