import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import {
	SituationComparée,
	SituationFamiliale,
	useComparateur,
} from '@/contextes/comparateur'
import { RadioChoiceGroup } from '@/design-system'

export const SituationFamilialeQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(newValue: Key) => set.situationFamiliale(newValue as SituationFamiliale),
		[set]
	)

	const options = [
		{
			key: 'celibataire',
			value: 'célibataire',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.situation-familiale.célibataire.label',
				'Célibataire, divorcé/divorcée ou union libre'
			),
		},
		{
			key: 'couple',
			value: 'couple',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.situation-familiale.couple.label',
				'Marié/mariée ou pacsé/pacsée'
			),
		},
		{
			key: 'veuf',
			value: 'veuf',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.situation-familiale.veuf.label',
				'Veuf/veuve'
			),
		},
	]

	return (
		<RadioChoiceGroup
			value={situation.situationFamiliale}
			onChange={handleChange}
			options={options}
		/>
	)
}

const SituationFamilialeValeur = () => {
	const { situation } = useComparateur()

	return situation.situationFamiliale
}

SituationFamilialeQuestion._tag = 'QuestionFournie'
SituationFamilialeQuestion.id = 'situation-familiale'
SituationFamilialeQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.situation-familiale.libellé',
		'Situation de famille'
	)
SituationFamilialeQuestion.typeRadioGroup = true
SituationFamilialeQuestion.applicable = (
	situation: SituationComparée | undefined
) => situation?.méthodeImposition === 'barème standard'
SituationFamilialeQuestion.Valeur = SituationFamilialeValeur
