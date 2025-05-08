import { Option, pipe } from 'effect'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { QuestionTypée } from '@/components/Simulation/QuestionFournie'
import { Radio, ToggleGroup } from '@/design-system'
import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'

interface Props {
	situation: Option.Option<SituationLocationCourteDuree>
	onRéponse: (réponse: Option.Option<boolean>) => void
}

const AlsaceMoselleQuestion = ({ situation, onRéponse }: Props) => {
	const { t } = useTranslation()

	const boolValue = pipe(
		situation,
		Option.flatMap((s) => s.estAlsaceMoselle),
		Option.getOrUndefined
	)
	const value = boolValue ?? boolValue ? 'oui' : 'non'

	const handleChange = useCallback(
		(newValue: string) => {
			const boolValue = newValue === 'oui'
			onRéponse(Option.some(boolValue))
		},
		[onRéponse]
	)

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

export const questionEstAlsaceMoselle: QuestionTypée<
	SituationLocationCourteDuree,
	Option.Option<boolean>
> = {
	_tag: 'QuestionFournie',
	id: 'est-alsace-moselle', // Identifiant unique
	libellé: 'Votre hébergement est-il situé en Alsace-Moselle ?',

	applicable: () => true,

	répond: (situation, réponse) => {
		return {
			...situation,
			estAlsaceMoselle: réponse,
		}
	},

	répondue: (situation) =>
		pipe(
			situation,
			Option.flatMap((s) => s.estAlsaceMoselle),
			Option.isSome
		),

	renderer: (situation, onRéponse) => (
		<AlsaceMoselleQuestion situation={situation} onRéponse={onRéponse} />
	),
}
