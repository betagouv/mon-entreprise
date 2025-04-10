import { Option } from 'effect'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Question } from '@/components/Simulation/Question'
import { Radio, ToggleGroup } from '@/design-system'
import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'

interface Props {
	situation: SituationLocationCourteDuree
	onRéponse: (réponse: Option.Option<boolean>) => void
}

const AlsaceMoselleQuestion = ({ situation, onRéponse }: Props) => {
	const { t } = useTranslation()

	const boolValue = Option.getOrNull(situation.estAlsaceMoselle)
	const value = boolValue === null 
		? undefined 
		: boolValue ? 'oui' : 'non'

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
			<Radio value="oui">
				{t('conversation.yes', 'Oui')}
			</Radio>
			<Radio value="non">
				{t('conversation.no', 'Non')}
			</Radio>
		</ToggleGroup>
	)
}

export const questionEstAlsaceMoselle: Question<
	SituationLocationCourteDuree,
	Option.Option<boolean>
> = {
	libellé: 'Votre hébergement est-il situé en Alsace-Moselle ?',

	applicable: (situation) => Option.isSome(situation.regimeCotisation),

	répond: (situation, réponse) => {
		return {
			...situation,
			estAlsaceMoselle: réponse,
		}
	},

	estRépondue: (situation) => Option.isSome(situation.estAlsaceMoselle),

	renderer: (situation, onRéponse) => (
		<AlsaceMoselleQuestion situation={situation} onRéponse={onRéponse} />
	),
}
