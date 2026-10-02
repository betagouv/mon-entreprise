import { Key, lazy, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestionFournie } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import {
	NatureActivité,
	SituationComparée,
	useComparateur,
} from '@/contextes/comparateur'
import { MDXWrapper, RadioChoiceGroup } from '@/design-system'
import i18n from '@/locales/i18n'

export const NatureActivitéQuestion: ComposantQuestionFournie<
	SituationComparée
> = () => {
	const { situation, set } = useComparateur()
	const { t } = useTranslation()

	const handleChange = useCallback(
		(newValue: Key) => set.natureActivité(newValue as NatureActivité),
		[set]
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
			value={situation.natureActivité}
			onChange={handleChange}
			options={options}
		/>
	)
}

const NatureActivitéValeur = () => {
	const { situation } = useComparateur()

	return situation.natureActivité
}

const NatureActivitéDocumentation = lazy(
	() => import(`./NatureActiviteDocumentation.${i18n.language}.mdx`)
)

NatureActivitéQuestion._tag = 'QuestionFournie'
NatureActivitéQuestion.id = 'activité-nature'
NatureActivitéQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.comparaison-statuts.questions.activité-nature.libellé',
		'Activité principale'
	)
NatureActivitéQuestion.typeRadioGroup = true
NatureActivitéQuestion.applicable = () => true
NatureActivitéQuestion.Valeur = NatureActivitéValeur
NatureActivitéQuestion.documentation = {
	Documentation: () => (
		<MDXWrapper>
			<NatureActivitéDocumentation />
		</MDXWrapper>
	),
	références: {
		'Création d’entreprise : déterminer la nature de l’activité d’une entreprise':
			'https://entreprendre.service-public.gouv.fr/vosdroits/F32887',
	},
}
