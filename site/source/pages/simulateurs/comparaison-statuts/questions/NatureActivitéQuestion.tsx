import * as O from 'effect/Option'
import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { RadioChoiceGroup } from '@/design-system'
import { useComparateur } from '@/domaine/comparateur/ComparateurContext'
import { SituationComparée } from '@/domaine/comparateur/situation'

export const NatureActivitéQuestion: ComposantQuestion<
	SituationComparée
> = () => {
	const { t } = useTranslation()
	const { comparateur, updateComparateur } = useComparateur()

	const handleChange = useCallback(
		(newValue: Key) => {
			const prevValue = comparateur.situation.natureActivité
			if (newValue && newValue !== prevValue) {
				updateComparateur((prevComparateur) => {
					let newComparateur = prevComparateur.set.réponse(
						'natureActivité',
						newValue as 'artisanale' | 'commerciale' | 'libérale'
					)
					if (
						newValue === 'libérale' &&
						(prevValue === 'artisanale' || prevValue === 'commerciale')
					) {
						newComparateur = newComparateur.set.réponse(
							'typeActivité',
							O.none() as O.Option<'vente' | 'service'>
						)
					} else if (
						prevValue === 'libérale' &&
						(newValue === 'artisanale' || newValue === 'commerciale')
					) {
						newComparateur = newComparateur.set.réponse(
							'activitéLibéraleRéglementée',
							O.none() as O.Option<boolean>
						)
					}

					return newComparateur
				})
			}
			console.log(comparateur.situation)
			console.log(comparateur.compare())
		},
		[updateComparateur]
	)

	const options = [
		{
			key: 'artisanale',
			value: 'artisanale',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.activité-nature.artisanale.label',
				'Artisanale'
			),
		},
		{
			key: 'commerciale',
			value: 'commerciale',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.activité-nature.commerciale.label',
				'Commerciale'
			),
		},
		{
			key: 'libérale',
			value: 'libérale',
			label: t(
				'pages.simulateurs.comparaison-statuts.questions.activité-nature.libérale.label',
				'Libérale'
			),
		},
	]

	return (
		<RadioChoiceGroup
			value={comparateur.situation.natureActivité}
			onChange={handleChange}
			options={options}
		/>
	)
}

NatureActivitéQuestion._tag = 'QuestionFournie'
NatureActivitéQuestion.id = 'activité-nature'
NatureActivitéQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.activité-nature.libellé',
		'Quelle est la nature de votre activité ?'
	)
NatureActivitéQuestion.applicable = () => true
NatureActivitéQuestion.répondue = () => true
