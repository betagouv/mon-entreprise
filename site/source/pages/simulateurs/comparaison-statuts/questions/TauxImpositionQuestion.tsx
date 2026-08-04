import { Option } from 'effect'
import { useCallback } from 'react'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { QuantitéField } from '@/design-system'
import { Quantité, quantitéToString } from '@/domaine/Quantite'

export const TauxImpositionQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: Quantité<'%'> | undefined) =>
			set.tauxImposition(Option.fromNullable(newValue)),
		[set]
	)

	return (
		<QuantitéField
			value={Option.getOrUndefined(situation.tauxImposition)}
			unité="%"
			onChange={handleChange}
		/>
	)
}

const TauxImpositionValeur = () => {
	const { situation } = useComparateur()

	return Option.isSome(situation.tauxImposition)
		? quantitéToString(Option.getOrThrow(situation.tauxImposition))
		: undefined
}

TauxImpositionQuestion._tag = 'QuestionFournie'
TauxImpositionQuestion.id = 'taux-imposition'
TauxImpositionQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.taux-imposition.libellé',
		'Taux d’imposition'
	)
TauxImpositionQuestion.typeRadioGroup = false
TauxImpositionQuestion.applicable = (
	situation: SituationComparée | undefined
) => situation?.méthodeImposition === 'taux personnalisé'
TauxImpositionQuestion.Valeur = TauxImpositionValeur
