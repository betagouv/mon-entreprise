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

const PremiereAnneeQuestion = ({ situation, onRéponse }: Props) => {
	const { t } = useTranslation()

	const boolValue = pipe(
		situation,
		Option.map((s) => s.premièreAnnée),
		Option.getOrNull
	)
	const value = boolValue === null ? undefined : boolValue ? 'oui' : 'non'

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

export const questionPremiereAnnee: QuestionTypée<
	SituationLocationCourteDuree,
	Option.Option<boolean>
> = {
	_tag: 'QuestionFournie',
	id: 'premiere-annee', // Identifiant unique
	libellé: "Est-ce votre première année d'activité ?",

	applicable: (situation) =>
		pipe(
			situation,
			Option.map(
				(s: SituationLocationCourteDuree): boolean =>
					Option.isSome(s.regimeCotisation) && Option.isSome(s.estAlsaceMoselle)
			),
			Option.getOrElse(() => false)
		),

	répond: (situation, réponse) => {
		return {
			...situation,
			premièreAnnée: réponse,
		}
	},

	répondue: (situation) =>
		pipe(
			situation,
			Option.map((s) => Option.isSome(s.premièreAnnée)),
			Option.getOrElse(() => false)
		),

	renderer: (situation, onRéponse) => (
		<PremiereAnneeQuestion situation={situation} onRéponse={onRéponse} />
	),
}
