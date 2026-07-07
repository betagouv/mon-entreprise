import { useTranslation } from 'react-i18next'

import { SIMULATION_COMMENCEE, TrackPage } from '@/components/PianoAnalytics/index'
import { estInformationsValides, useCMG } from '@/contextes/cmg/index'

import QuestionCMGPerçu from '../components/informations-generales/QuestionCMGPercu'
import QuestionNombreMoisDéclarationsSuffisant from '../components/informations-generales/QuestionNombreMoisDeclarationsSuffisant'
import QuestionRessources from '../components/informations-generales/QuestionRessources'
import QuestionSituationFamiliale from '../components/informations-generales/QuestionSituationFamiliale'
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
						'pages.assistants.cmg.informations-generales.erreurs',
						'Toutes les questions sont obligatoires.'
					)}
				</MessageFormulaireInvalide>
			)}
		</>
	)
}
