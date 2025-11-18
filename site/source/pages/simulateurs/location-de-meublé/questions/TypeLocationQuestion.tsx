import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	useEconomieCollaborative,
	type SituationÉconomieCollaborative,
	type TypeLocation,
} from '@/contextes/économie-collaborative'
import { RadioCard, RadioCardGroup } from '@/design-system'

interface Props {}

export const TypeLocationQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: string) => {
			if (newValue) {
				set.typeLocation(O.some(newValue as TypeLocation))
			}
		},
		[set]
	)

	const typeLocation = O.getOrUndefined(situation.typeLocation)

	return (
		<RadioCardGroup
			aria-label={t(
				'conversation.multiple-answer.aria-label',
				'Choix multiples'
			)}
			value={typeLocation}
			onChange={handleChange}
		>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-location.non-classé.label',
					'Logement meublé'
				)}
				value="non-classé"
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-location.non-classé.description',
					"Location d'un logement meublé non classé."
				)}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-location.tourisme.label',
					'Logement meublé de tourisme classé'
				)}
				value="tourisme"
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-location.tourisme.description',
					'Location d’un logement meublé classé meublé de tourisme.'
				)}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-location.chambre-hôte.label',
					"Chambre d'hôte"
				)}
				value="chambre-hôte"
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.type-location.chambre-hôte.description',
					"Location d'une chambre chez l'habitant avec services associés."
				)}
			/>
		</RadioCardGroup>
	)
}

TypeLocationQuestion._tag = 'QuestionFournie'
TypeLocationQuestion.id = 'type-location'
TypeLocationQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.location-de-logement-meublé.questions.type-location.libellé',
		'Quel est le type de logement ?'
	)
TypeLocationQuestion.applicable = () => true // Toujours applicable
TypeLocationQuestion.répondue = (situation) => O.isSome(situation.typeLocation)
