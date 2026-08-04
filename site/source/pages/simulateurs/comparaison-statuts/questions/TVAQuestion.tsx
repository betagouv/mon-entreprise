import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const TVAQuestion: ComposantQuestionFournie<SituationComparée> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) => set.tva(fromOuiNon(newValue)),
		[set]
	)

	return <OuiNonInput value={toOuiNon(situation.tva)} onChange={handleChange} />
}

const TVAValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.tva)
}

TVAQuestion._tag = 'QuestionFournie'
TVAQuestion.id = 'tva'
TVAQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.tva.libellé',
		'Entreprise assujettie à la TVA'
	)
TVAQuestion.typeRadioGroup = true
TVAQuestion.applicable = () => true
TVAQuestion.Valeur = TVAValeur
