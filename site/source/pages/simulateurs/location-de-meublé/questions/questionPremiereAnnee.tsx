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

const PremiereAnneeQuestion = ({ situation, onRéponse }: Props) => {
	const { t } = useTranslation()

	const boolValue = Option.getOrNull(situation.premièreAnnée)
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

export const questionPremiereAnnee: Question<
	SituationLocationCourteDuree,
	Option.Option<boolean>
> = {
	libellé: "Est-ce votre première année d'activité ?",

	applicable: (situation) =>
		Option.isSome(situation.regimeCotisation) &&
		Option.isSome(situation.estAlsaceMoselle),

	répond: (situation, réponse) => {
		return {
			...situation,
			premièreAnnée: réponse,
		}
	},

	estRépondue: (situation) => Option.isSome(situation.premièreAnnée),

	renderer: (situation, onRéponse) => (
		<PremiereAnneeQuestion situation={situation} onRéponse={onRéponse} />
	),
}
