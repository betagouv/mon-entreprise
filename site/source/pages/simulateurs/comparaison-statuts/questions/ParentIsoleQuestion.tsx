import { useCallback } from 'react'

import { OuiNonInput } from '@/components/conversation/OuiNonInput'
import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { fromOuiNon, OuiNon, toOuiNon } from '@/domaine/OuiNon'

export const ParentIsoléQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: OuiNon | undefined) => set.parentIsolé(fromOuiNon(newValue)),
		[set]
	)

	return (
		<OuiNonInput
			value={toOuiNon(situation.parentIsolé)}
			onChange={handleChange}
		/>
	)
}

const ParentIsoléValeur = () => {
	const { situation } = useComparateur()

	return toOuiNon(situation.parentIsolé)
}

ParentIsoléQuestion._tag = 'QuestionFournie'
ParentIsoléQuestion.id = 'parent-isolé'
ParentIsoléQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.parent-isolé.libellé',
		'Parent isolé'
	)
ParentIsoléQuestion.typeRadioGroup = true
ParentIsoléQuestion.applicable = (situation: SituationComparée | undefined) =>
	situation?.méthodeImposition === 'barème standard' &&
	situation?.situationFamiliale === 'célibataire' &&
	!!situation?.enfants.valeur
ParentIsoléQuestion.Valeur = ParentIsoléValeur
