import { Option } from 'effect'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Question } from '@/components/Simulation/Question'
import { RadioCardGroup, RadioCard } from '@/design-system'
import {
	RegimeCotisation,
	SituationLocationCourteDuree,
} from '@/domaine/économie-collaborative/location-de-meublé/situation'

interface Props {
	situation: SituationLocationCourteDuree
	onRéponse: (réponse: Option.Option<RegimeCotisation>) => void
}

const RegimeCotisationQuestion = ({ situation, onRéponse }: Props) => {
	const { t } = useTranslation()

	const regimeCotisation = Option.getOrUndefined(situation.regimeCotisation)

	const handleChange = useCallback(
		(newValue: string) => {
			if (newValue) {
				onRéponse(Option.some(newValue as RegimeCotisation))
			}
		},
		[onRéponse]
	)

	return (
		<RadioCardGroup
			aria-label={t('conversation.multiple-answer.aria-label', 'Choix multiples')}
			value={regimeCotisation}
			onChange={handleChange}
		>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.régime-général.label',
					'Régime général (cotisations URSSAF)'
				)}
				value={RegimeCotisation['régime-général']}
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.régime-général.description',
					'Comme pour un salarié, des cotisations sociales seront prélevées à la source.'
				)}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.label',
					'Micro-entreprise'
				)}
				value={RegimeCotisation['micro-entreprise']}
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.description',
					"Vous payez un pourcentage fixe de votre chiffre d'affaires."
				)}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.travailleur-indépendant.label',
					'Travailleur indépendant'
				)}
				value={RegimeCotisation['travailleur-indépendant']}
				description={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.travailleur-indépendant.description',
					'Vous payez des cotisations sociales sur votre bénéfice.'
				)}
			/>
		</RadioCardGroup>
	)
}

export const questionRegimeCotisation: Question<
	SituationLocationCourteDuree,
	Option.Option<RegimeCotisation>
> = {
	libellé: 'Quel régime de cotisation souhaitez-vous simuler ?',

	applicable: (situation) => Option.isSome(situation.recettes),

	répond: (situation, réponse) => {
		return {
			...situation,
			regimeCotisation: réponse,
		}
	},

	estRépondue: (situation) => Option.isSome(situation.regimeCotisation),

	renderer: (situation, onRéponse) => (
		<RegimeCotisationQuestion situation={situation} onRéponse={onRéponse} />
	),
}
