import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	SituationÉconomieCollaborative,
	TypeLocation,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative/hooks/useEconomieCollaborative'
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
				label="Logement meublé de courte durée"
				value="non-classé"
				description="Location d'un logement meublé non classé pour de courtes durées."
			/>
			<RadioCard
				label="Logement meublé de tourisme classé de courte durée"
				value="tourisme"
				description="Location d'un logement meublé classé meublé de tourisme pour de courtes durées."
			/>
			<RadioCard
				label="Chambre d'hôte"
				value="chambre-hôte"
				description="Location d'une chambre chez l'habitant avec services associés."
			/>
		</RadioCardGroup>
	)
}

TypeLocationQuestion._tag = 'QuestionFournie'
TypeLocationQuestion.id = 'type-location'
TypeLocationQuestion.libellé = 'Quel est le type de location concernée ?'
TypeLocationQuestion.applicable = () => true // Toujours applicable
TypeLocationQuestion.répondue = (situation) =>
	O.isSome(situation.typeLocation)