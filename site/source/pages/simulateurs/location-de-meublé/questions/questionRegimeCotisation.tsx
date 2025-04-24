import { Array, Option, pipe } from 'effect'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Question } from '@/components/Simulation/Question'
import { RadioCard, RadioCardGroup } from '@/design-system'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { compareRégimes } from '@/domaine/économie-collaborative/location-de-meublé/comparateur-régimes'
import {
	estSituationValide,
	RegimeCotisation,
	SituationLocationCourteDuree,
} from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { toString as formatMontant } from '@/domaine/Montant'

interface Props {
	situation: SituationLocationCourteDuree
	onRéponse: (réponse: Option.Option<RegimeCotisation>) => void
}

const trouveEstimationPourRégime = (
	résultats: ReturnType<typeof compareRégimes>,
	régime: RegimeCotisation
) => Array.findFirst(résultats, (résultat) => résultat.régime === régime)

const RegimeCotisationQuestion = ({ situation, onRéponse }: Props) => {
	const { t } = useTranslation()

	const regimeCotisation = Option.getOrUndefined(situation.regimeCotisation)

	const comparaisonRégimes = pipe(
		situation,
		Option.liftPredicate(estSituationValide),
		Option.map(compareRégimes)
	)

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
			aria-label={t(
				'conversation.multiple-answer.aria-label',
				'Choix multiples'
			)}
			value={regimeCotisation}
			onChange={handleChange}
		>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.régime-général.label',
					'Régime général (cotisations URSSAF)'
				)}
				value={RegimeCotisation.regimeGeneral}
				description={
					<>
						{t(
							'pages.simulateurs.location-de-logement-meublé.questions.regime.options.régime-général.description',
							'Comme pour un salarié, des cotisations sociales seront prélevées à la source.'
						)}
						{pipe(
							comparaisonRégimes,
							Option.flatMap((résultats) =>
								trouveEstimationPourRégime(
									résultats,
									RegimeCotisation.regimeGeneral
								)
							),
							Option.match({
								onNone: () => <SmallBody>Estimation impossible</SmallBody>,
								onSome: (résultat) =>
									résultat.applicable ? (
										<SmallBody>
											<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.estimation">
												Estimation des cotisations :{' '}
												<strong>{formatMontant(résultat.cotisations)}</strong>
											</Trans>
										</SmallBody>
									) : null,
							})
						)}
					</>
				}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.label',
					'Micro-entreprise'
				)}
				value={RegimeCotisation.microEntreprise}
				description={
					<>
						{t(
							'pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.description',
							"Vous payez un pourcentage fixe de votre chiffre d'affaires."
						)}
						{pipe(
							comparaisonRégimes,
							Option.flatMap((résultats) =>
								trouveEstimationPourRégime(
									résultats,
									RegimeCotisation.microEntreprise
								)
							),
							Option.match({
								onNone: () => <SmallBody>Estimation impossible</SmallBody>,
								onSome: (résultat) =>
									résultat.applicable ? (
										<SmallBody>
											<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.estimation">
												Estimation des cotisations :{' '}
												<strong>{formatMontant(résultat.cotisations)}</strong>
											</Trans>
										</SmallBody>
									) : null,
							})
						)}
					</>
				}
			/>
			<RadioCard
				label={t(
					'pages.simulateurs.location-de-logement-meublé.questions.regime.options.travailleur-indépendant.label',
					'Travailleur indépendant'
				)}
				value={RegimeCotisation.travailleurIndependant}
				description={
					<>
						{t(
							'pages.simulateurs.location-de-logement-meublé.questions.regime.options.travailleur-indépendant.description',
							'Vous payez des cotisations sociales sur votre bénéfice.'
						)}
						{pipe(
							comparaisonRégimes,
							Option.flatMap((résultats) =>
								trouveEstimationPourRégime(
									résultats,
									RegimeCotisation.travailleurIndependant
								)
							),
							Option.match({
								onNone: () => <SmallBody>Estimation impossible</SmallBody>,
								onSome: (résultat) =>
									résultat.applicable ? (
										<SmallBody>
											<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.estimation">
												Estimation des cotisations :{' '}
												<strong>{formatMontant(résultat.cotisations)}</strong>
											</Trans>
										</SmallBody>
									) : null,
							})
						)}
					</>
				}
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
