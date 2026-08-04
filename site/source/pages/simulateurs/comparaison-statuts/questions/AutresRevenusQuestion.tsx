import { useCallback } from 'react'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée, useComparateur } from '@/contextes/comparateur'
import { MontantField } from '@/design-system'
import { eurosParAn, Montant, montantToString } from '@/domaine/Montant'

export const AutresRevenusQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()

	const handleChange = useCallback(
		(newValue: Montant<'€/an'> | undefined) =>
			set.autresRevenus(newValue ?? eurosParAn(0)),
		[set]
	)

	return (
		<MontantField
			value={situation.autresRevenus}
			unité="€/an"
			onChange={handleChange}
		/>
	)
}

const AutresRevenusValeur = () => {
	const { situation } = useComparateur()

	return montantToString(situation.autresRevenus)
}

AutresRevenusQuestion._tag = 'QuestionFournie'
AutresRevenusQuestion.id = 'autres-revenus'
AutresRevenusQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.autres-revenus.libellé',
		'Autres revenus imposables'
	)
AutresRevenusQuestion.typeRadioGroup = false
AutresRevenusQuestion.applicable = (situation: SituationComparée | undefined) =>
	situation?.méthodeImposition === 'barème standard'
AutresRevenusQuestion.Valeur = AutresRevenusValeur
