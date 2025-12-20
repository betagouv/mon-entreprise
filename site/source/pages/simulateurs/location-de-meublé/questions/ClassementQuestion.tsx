import * as O from 'effect/Option'
import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	useEconomieCollaborative,
	type Classement,
	type SituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { RadioChoiceGroup } from '@/design-system'

interface Props {}

export const ClassementQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: Key) => {
			if (newValue) {
				set.classement(O.some(newValue as Classement))
			}
		},
		[set]
	)

	const classement =
		situation.typeHébergement === 'meublé-tourisme'
			? O.getOrUndefined(situation.classement)
			: undefined

	const options = [
		{
			key: 'classé',
			value: 'classé',
			label: t(
				'pages.simulateurs.location-de-logement-meublé.questions.classement.classé.label',
				'Classé'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.questions.classement.classé.description',
				'Votre hébergement est classé meublé de tourisme (de 1 à 5 étoiles).'
			),
		},
		{
			key: 'non-classé',
			value: 'non-classé',
			label: t(
				'pages.simulateurs.location-de-logement-meublé.questions.classement.non-classé.label',
				'Non classé'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.questions.classement.non-classé.description',
				"Votre hébergement n'a pas de classement officiel."
			),
		},
		{
			key: 'mixte',
			value: 'mixte',
			label: t(
				'pages.simulateurs.location-de-logement-meublé.questions.classement.mixte.label',
				'Mixte'
			),
			description: t(
				'pages.simulateurs.location-de-logement-meublé.questions.classement.mixte.description',
				'Vous proposez à la fois des hébergements classés et non classés.'
			),
		},
	]

	return (
		<RadioChoiceGroup
			value={classement}
			onChange={handleChange}
			options={options}
		/>
	)
}

ClassementQuestion._tag = 'QuestionFournie'
ClassementQuestion.id = 'classement'
ClassementQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.location-de-logement-meublé.questions.classement.libellé',
		'Votre hébergement est-il classé meublé de tourisme ?'
	)
ClassementQuestion.applicable = (situation) => {
	if (situation.typeHébergement !== 'meublé-tourisme') {
		return false
	}

	if (!O.isSome(situation.typeDurée)) {
		return false
	}

	const typeDurée = situation.typeDurée.value

	return typeDurée === 'courte' || typeDurée === 'mixte'
}
ClassementQuestion.répondue = (situation) => {
	if (situation.typeHébergement !== 'meublé-tourisme') {
		return false
	}

	return O.isSome(situation.classement)
}
