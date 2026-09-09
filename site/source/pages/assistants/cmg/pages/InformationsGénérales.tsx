import { useTranslation } from 'react-i18next'

import {
	SIMULATION_COMMENCEE,
	TrackPage,
} from '@/components/ATInternetTracking'
import { estInformationsValides, useCMG } from '@/contextes/cmg'

import QuestionCMGPerçu from '../components/informations-générales/QuestionCMGPerçu'
import QuestionNombreMoisDéclarationsSuffisant from '../components/informations-générales/QuestionNombreMoisDéclarationsSuffisant'
import QuestionRessources from '../components/informations-générales/QuestionRessources'
import QuestionSituationFamiliale from '../components/informations-générales/QuestionSituationFamiliale'
import Navigation from '../components/Navigation'
import { MessageFormulaireInvalide } from '../components/styled-components'

export default function InformationsGénérales() {
	const { situation } = useCMG()
	const { t } = useTranslation()
	const isSuivantDisabled = !estInformationsValides(situation)

	return (
		<>
			<TrackPage chapter3="pas_a_pas" name={SIMULATION_COMMENCEE} />

			<QuestionNombreMoisDéclarationsSuffisant />
			<QuestionCMGPerçu />
			<QuestionSituationFamiliale />
			<QuestionRessources />

			<Navigation
				précédent="index"
				suivant="enfants"
				isSuivantDisabled={isSuivantDisabled}
			/>

			{isSuivantDisabled && (
				<MessageFormulaireInvalide>
					{t(
						'pages.assistants.cmg.informations-générales.erreurs',
						'Toutes les questions sont obligatoires.'
					)}
				</MessageFormulaireInvalide>
			)}
		</>
	)
}
