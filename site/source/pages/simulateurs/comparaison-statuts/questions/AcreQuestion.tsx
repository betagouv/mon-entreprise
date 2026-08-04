import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const AcreQuestion: ComposantQuestionFournie<SituationComparée> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) => set.acre(fromOuiNon(newValue)),
		[set]
	)

	return (
		<OuiNonInput value={toOuiNon(situation.acre)} onChange={handleChange} />
	)
}

const AcreValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.acre)
}

AcreQuestion._tag = 'QuestionFournie'
AcreQuestion.id = 'acre'
AcreQuestion.libellé = (t) =>
	t('pages.simulateurs.comparaison-statuts.questions.acre.libellé', 'Acre')
AcreQuestion.typeRadioGroup = true
AcreQuestion.applicable = () => true
AcreQuestion.Valeur = AcreValeur
