import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const ActivitéRéglementéeQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) =>
			set.activitéLibéraleRéglementée(fromOuiNon(newValue)),
		[set]
	)

	return (
		<OuiNonInput
			value={toOuiNon(situation.activitéLibéraleRéglementée)}
			onChange={handleChange}
		/>
	)
}

const ActivitéRéglementéeValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.activitéLibéraleRéglementée)
}

ActivitéRéglementéeQuestion._tag = 'QuestionFournie'
ActivitéRéglementéeQuestion.id = 'activité-réglementée'
ActivitéRéglementéeQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.activité-réglementée.libellé',
		'Activité réglementée'
	)
ActivitéRéglementéeQuestion.typeRadioGroup = true
ActivitéRéglementéeQuestion.applicable = (
	situation: SituationComparée | undefined
) => situation?.natureActivité === 'libérale'
ActivitéRéglementéeQuestion.Valeur = ActivitéRéglementéeValeur
