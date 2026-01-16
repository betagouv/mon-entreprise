import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	SituationÉconomieCollaborative,
	useEconomieCollaborative,
} from '@/contextes/économie-collaborative'
import { Radio, ToggleGroup } from '@/design-system'

interface Props {}

export const PremiereAnneeQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: string) => {
			const boolValue = newValue === 'oui'
			set.premiereAnnee(O.some(boolValue))
		},
		[set]
	)

	const boolValue = O.getOrNull(situation.premièreAnnée)

	const value = boolValue === null ? undefined : boolValue ? 'oui' : 'non'

	return (
		<ToggleGroup
			aria-label={t('conversation.yes-no.aria-label', 'Oui ou non')}
			onChange={handleChange}
			value={value}
		>
			<Radio value="oui">{t('conversation.yes', 'Oui')}</Radio>
			<Radio value="non">{t('conversation.no', 'Non')}</Radio>
		</ToggleGroup>
	)
}
PremiereAnneeQuestion._tag = 'QuestionFournie'
PremiereAnneeQuestion.id = 'premiere-annee'
PremiereAnneeQuestion.libellé = (t) =>
	t(
		'pages.simulateurs.location-de-logement-meublé.questions.premiere-annee.libellé',
		"Est-ce votre première année d'activité ?"
	)
PremiereAnneeQuestion.applicable = (situation) =>
	O.isSome(situation.estAlsaceMoselle)
PremiereAnneeQuestion.répondue = (situation) =>
	O.isSome(situation.premièreAnnée)
