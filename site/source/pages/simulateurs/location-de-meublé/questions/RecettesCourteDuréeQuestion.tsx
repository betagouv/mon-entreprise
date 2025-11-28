import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	estSituationMeubléDeTourismeValide,
	faitDeLaLocationCourteEtLongueDurée,
	useEconomieCollaborative,
	type SituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { MontantField } from '@/design-system'
import { Montant } from '@/domaine/Montant'

interface Props {}

export const RecettesCourteDuréeQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(montant: Montant<'€/an'> | undefined) => {
			set.recettesCourteDurée(O.fromNullable(montant))
		},
		[set]
	)

	if (
		!estSituationMeubléDeTourismeValide(situation) ||
		!faitDeLaLocationCourteEtLongueDurée(situation)
	) {
		return null
	}

	const recettesCourteDurée = O.getOrUndefined(situation.recettesCourteDurée)

	return (
		<MontantField
			value={recettesCourteDurée}
			unité="€/an"
			onChange={handleChange}
			aria={{
				label: t(
					'pages.simulateurs.location-de-logement-meublé.questions.recettes-courte-durée.aria-label',
					'Montant des recettes pour la location courte durée'
				),
			}}
		/>
	)
}

RecettesCourteDuréeQuestion._tag = 'QuestionFournie'
RecettesCourteDuréeQuestion.id = 'recettes-courte-duree'
RecettesCourteDuréeQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.location-de-logement-meublé.questions.recettes-courte-durée.libellé',
		'Quelle part des recettes provient de la location courte durée ?'
	)
RecettesCourteDuréeQuestion.applicable = (situation) =>
	estSituationMeubléDeTourismeValide(situation) &&
	faitDeLaLocationCourteEtLongueDurée(situation)

RecettesCourteDuréeQuestion.répondue = (situation) =>
	estSituationMeubléDeTourismeValide(situation) &&
	faitDeLaLocationCourteEtLongueDurée(situation) &&
	O.isSome(situation.recettesCourteDurée)
