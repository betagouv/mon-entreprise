import * as O from 'effect/Option'

import { useCMG } from '@/contextes/cmg'

import QuestionCMGPerçu from '../components/informations-générales/QuestionCMGPerçu'
import QuestionNombreMoisDéclarationsSuffisant from '../components/informations-générales/QuestionNombreMoisDéclarationsSuffisant'
import QuestionRessources from '../components/informations-générales/QuestionRessources'
import QuestionSituationFamiliale from '../components/informations-générales/QuestionSituationFamiliale'
import Navigation from '../components/Navigation'

export default function InformationsGénérales() {
	const { situation } = useCMG()
	const isSuivantDisabled =
		O.isNone(situation.aPerçuCMG) ||
		O.isNone(situation.plusDe2MoisDeDéclaration) ||
		O.isNone(situation.parentIsolé) ||
		O.isNone(situation.ressources)

	return (
		<>
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
