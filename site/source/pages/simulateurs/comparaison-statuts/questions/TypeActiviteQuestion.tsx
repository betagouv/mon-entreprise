import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import {
	SituationComparée,
	TypeActivité,
	useComparateur,
} from '@/contextes/comparateur'
import { RadioChoiceGroup } from '@/design-system'

export const TypeActivitéQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(newValue: Key) => set.typeActivité(newValue as TypeActivité),
		[set]
	)

	const options = [
		{
			key: 'vente',
			value: 'vente',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.activité-type.vente.label',
				'Vente de biens, restauration ou hébergement'
			),
		},
		{
			key: 'service',
			value: 'service',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.activité-type.service.label',
				'Prestation de service'
			),
		},
	]

	return (
		<RadioChoiceGroup
			value={situation.typeActivité}
			onChange={handleChange}
			options={options}
		/>
	)
}

const TypeActivitéValeur = () => {
	const { situation } = useComparateur()

	return situation.typeActivité
}

TypeActivitéQuestion._tag = 'QuestionFournie'
TypeActivitéQuestion.id = 'activité-type'
TypeActivitéQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.activité-type.libellé',
		'Type d’activité'
	)
TypeActivitéQuestion.typeRadioGroup = true
TypeActivitéQuestion.applicable = (situation: SituationComparée | undefined) =>
	situation?.natureActivité !== 'libérale'
TypeActivitéQuestion.Valeur = TypeActivitéValeur
