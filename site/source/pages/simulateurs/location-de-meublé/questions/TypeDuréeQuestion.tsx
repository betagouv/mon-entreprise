import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	estActiviteProfessionnelle,
	estSituationMeubléDeTourismeValide,
	estSituationValide,
	SituationÉconomieCollaborative,
	useEconomieCollaborative,
	type TypeDurée,
} from '@/contextes/économie-collaborative'
import { RadioCard, RadioCardGroup } from '@/design-system'

interface Props {}

export const TypeDuréeQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: string) => {
			if (newValue) {
				set.typeDurée(O.some(newValue as TypeDurée))
			}
		},
		[set]
	)

	if (!estSituationMeubléDeTourismeValide(situation)) {
		return null
	}

	const typeDurée = O.getOrUndefined(situation.typeDurée)

	return (
		<RadioCardGroup
			aria-label={t(
				'conversation.multiple-answer.aria-label',
				'Choix multiples'
			)}
			value={typeDurée}
			onChange={handleChange}
		>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-durée.courte.label',
					'Location courte durée uniquement'
				)}
				value="courte"
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-durée.courte.description',
					'Vous proposez uniquement de la location de courte durée (type Airbnb, moins de 3 mois).'
				)}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-durée.longue.label',
					'Location longue durée uniquement'
				)}
				value="longue"
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-durée.longue.description',
					'Vous proposez uniquement de la location de longue durée (bail de résidence principale, plus de 3 mois).'
				)}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-durée.mixte.label',
					'Mixte (courte et longue durée)'
				)}
				value="mixte"
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-durée.mixte.description',
					'Vous proposez à la fois de la location courte durée et longue durée.'
				)}
			/>
		</RadioCardGroup>
	)
}

TypeDuréeQuestion._tag = 'QuestionFournie'
TypeDuréeQuestion.id = 'type-duree'
TypeDuréeQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.location-de-logement-meublé.questions.type-durée.libellé',
		'Proposez-vous de la location courte ou longue durée ?'
	)
TypeDuréeQuestion.applicable = (situation) =>
	situation.typeHébergement === 'meublé-tourisme' &&
	estSituationValide(situation) &&
	estActiviteProfessionnelle(situation)
TypeDuréeQuestion.répondue = (situation) =>
	situation.typeHébergement === 'meublé-tourisme'
		? O.isSome(situation.typeDurée)
		: false
