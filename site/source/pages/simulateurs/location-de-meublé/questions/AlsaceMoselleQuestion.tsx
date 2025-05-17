import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import { SituationÉconomieCollaborative } from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative/store/useEconomieCollaborative.hook'
import { Radio, ToggleGroup } from '@/design-system'

interface Props {}

export const AlsaceMoselleQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { ready, situation, setSituation } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: string) => {
			setSituation &&
				setSituation({
					...situation,
					estAlsaceMoselle: O.some(newValue === 'oui'),
				})
		},
		[situation, setSituation]
	)

	if (!ready) return null

	const value = O.isSome(situation.estAlsaceMoselle)
		? situation.estAlsaceMoselle.value
			? 'oui'
			: 'non'
		: undefined

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
AlsaceMoselleQuestion._tag = 'QuestionFournie'
AlsaceMoselleQuestion.id = 'est-alsace-moselle'
AlsaceMoselleQuestion.libellé =
	'Votre hébergement est-il situé en Alsace-Moselle ?'
AlsaceMoselleQuestion.applicable = () => true
AlsaceMoselleQuestion.répondue = (situation) =>
	O.isSome(situation.estAlsaceMoselle)
