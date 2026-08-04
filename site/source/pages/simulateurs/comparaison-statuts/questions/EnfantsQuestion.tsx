import { useCallback } from 'react'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { QuantitéField } from '@/design-system'
import { quantité, Quantité, quantitéToString } from '@/domaine/Quantite'

export const EnfantsQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: Quantité<'enfant'> | undefined) =>
			set.enfants(newValue ?? quantité(0, 'enfant')),
		[set]
	)

	return (
		<QuantitéField
			value={situation.enfants}
			unité="enfant"
			onChange={handleChange}
		/>
	)
}

const EnfantsValeur = () => {
	const { situation } = useComparateur()

	return quantitéToString(situation.enfants)
}

EnfantsQuestion._tag = 'QuestionFournie'
EnfantsQuestion.id = 'enfants'
EnfantsQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.enfants.libellé',
		'Enfants à charge'
	)
EnfantsQuestion.typeRadioGroup = false
EnfantsQuestion.applicable = (situation: SituationComparée | undefined) =>
	situation?.méthodeImposition === 'barème standard'
EnfantsQuestion.Valeur = EnfantsValeur
