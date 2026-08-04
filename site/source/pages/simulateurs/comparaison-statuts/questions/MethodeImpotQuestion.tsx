import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import {
	MéthodeImposition,
	SituationComparée,
	useComparateur,
} from '@/contextes/comparateur'
import { RadioChoiceGroup } from '@/design-system'

export const MéthodeImpôtQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(newValue: Key) => set.méthodeImposition(newValue as MéthodeImposition),
		[set]
	)

	const options = [
		{
			key: 'bareme',
			value: 'barème standard',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.méthode-impôt.barème.label',
				'avec le barème standard'
			),
		},
		{
			key: 'taux',
			value: 'taux personnalisé',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.méthode-impôt.taux.label',
				'avec un taux personnalisé'
			),
		},
	]

	return (
		<RadioChoiceGroup
			value={situation.méthodeImposition}
			onChange={handleChange}
			options={options}
		/>
	)
}

const MéthodeImpôtValeur = () => {
	const { situation } = useComparateur()

	return situation.méthodeImposition
}

MéthodeImpôtQuestion._tag = 'QuestionFournie'
MéthodeImpôtQuestion.id = 'méthode-impôt'
MéthodeImpôtQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.méthode-impôt.libellé',
		'Méthode de calcul de l’impôt sur le revenu'
	)
MéthodeImpôtQuestion.typeRadioGroup = true
MéthodeImpôtQuestion.applicable = () => true
MéthodeImpôtQuestion.Valeur = MéthodeImpôtValeur
