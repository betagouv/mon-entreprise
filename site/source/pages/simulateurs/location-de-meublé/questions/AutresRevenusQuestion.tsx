import * as O from 'effect/Option'
import { useCallback } from 'react'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	estActiviteProfessionnelle,
	SituationÉconomieCollaborativeValide,
	useEconomieCollaborative,
	type SituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { type Montant } from '@/domaine/Montant'

interface Props {}

export const AutresRevenusQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: Montant<'€/an'> | undefined) => {
			if (newValue !== undefined) {
				set.autresRevenus(O.some(newValue))
			} else {
				set.autresRevenus(O.none())
			}
		},
		[set]
	)

	const autresRevenus = O.getOrUndefined(situation.autresRevenus)

	return (
		<MontantField
			label="Quel est le montant de vos autres revenus annuels ?"
			value={autresRevenus}
			onChange={handleChange}
			unité="€/an"
		/>
	)
}

AutresRevenusQuestion._tag = 'QuestionFournie'
AutresRevenusQuestion.id = 'autres-revenus'
AutresRevenusQuestion.libellé =
	'Quel est le montant de vos autres revenus annuels ?'
AutresRevenusQuestion.applicable = (situation) => {
	return O.match(situation.recettes, {
		onNone: () => false,
		onSome: () =>
			estActiviteProfessionnelle(
				situation as SituationÉconomieCollaborativeValide
			),
	})
}
AutresRevenusQuestion.répondue = (situation) =>
	O.isSome(situation.autresRevenus)
