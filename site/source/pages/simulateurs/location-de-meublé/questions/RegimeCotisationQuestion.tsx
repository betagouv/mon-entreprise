import { Array, pipe } from 'effect'
import * as O from 'effect/Option'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ComposantQuestion } from '@/components/Simulation/ComposantQuestion'
import {
	compareRégimes,
	SituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import {
	estSituationValide,
	RegimeCotisation,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { useEconomieCollaborative } from '@/contextes/économie-collaborative/hooks/useEconomieCollaborative'
import { RadioCard, RadioCardGroup, SmallBody } from '@/design-system'
import { toString as formatMontant } from '@/domaine/Montant'

interface Props {}

const trouveEstimationPourRégime = (
	résultats: ReturnType<typeof compareRégimes>,
	régime: RegimeCotisation
) => Array.findFirst(résultats, (résultat) => résultat.régime === régime)

export const RegimeCotisationQuestion: ComposantQuestion<
	SituationÉconomieCollaborative,
	Props
> = () => {
	const { t } = useTranslation()
	const { situation, set } = useEconomieCollaborative()

	const handleChange = useCallback(
		(newValue: string) => {
			if (newValue) {
				set.regimeCotisation(O.some(newValue as RegimeCotisation))
			}
		},
		[set]
	)

	const comparaisonRégimes = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(compareRégimes)
	)

	const regimeCotisation = O.getOrUndefined(situation.regimeCotisation)

	const régimeGénéralApplicable = pipe(
		comparaisonRégimes,
		O.flatMap((résultats) =>
			trouveEstimationPourRégime(résultats, RegimeCotisation.regimeGeneral)
		),
		O.map((r) => r.applicable),
		O.getOrElse(() => true) // Par défaut, afficher le régime
	)

	const microEntrepriseApplicable = pipe(
		comparaisonRégimes,
		O.flatMap((résultats) =>
			trouveEstimationPourRégime(résultats, RegimeCotisation.microEntreprise)
		),
		O.map((r) => r.applicable),
		O.getOrElse(() => true)
	)

	const travailleurIndépendantApplicable = pipe(
		comparaisonRégimes,
		O.flatMap((résultats) =>
			trouveEstimationPourRégime(
				résultats,
				RegimeCotisation.travailleurIndependant
			)
		),
		O.map((r) => r.applicable),
		O.getOrElse(() => true)
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
			{régimeGénéralApplicable && (
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
								O.flatMap((résultats) =>
									trouveEstimationPourRégime(
										résultats,
										RegimeCotisation.regimeGeneral
									)
								),
								O.match({
									onNone: () => <SmallBody>Estimation impossible</SmallBody>,
									onSome: (résultat) =>
										résultat.applicable ? (
											<SmallBody>
												{t(
													'pages.simulateurs.location-de-logement-meublé.questions.regime.options.estimation',
													'Estimation des cotisations'
												)}{' '}
												: <strong>{formatMontant(résultat.cotisations)}</strong>
											</SmallBody>
										) : null,
								})
							)}
						</>
					}
				/>
			)}
			{microEntrepriseApplicable && (
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
								O.flatMap((résultats) =>
									trouveEstimationPourRégime(
										résultats,
										RegimeCotisation.microEntreprise
									)
								),
								O.match({
									onNone: () => <SmallBody>Estimation impossible</SmallBody>,
									onSome: (résultat) =>
										résultat.applicable ? (
											<SmallBody>
												{t(
													'pages.simulateurs.location-de-logement-meublé.questions.regime.options.estimation',
													'Estimation des cotisations'
												)}{' '}
												: <strong>{formatMontant(résultat.cotisations)}</strong>
											</SmallBody>
										) : null,
								})
							)}
						</>
					}
				/>
			)}
			{travailleurIndépendantApplicable && (
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
								O.flatMap((résultats) =>
									trouveEstimationPourRégime(
										résultats,
										RegimeCotisation.travailleurIndependant
									)
								),
								O.match({
									onNone: () => <SmallBody>Estimation impossible</SmallBody>,
									onSome: (résultat) =>
										résultat.applicable ? (
											<SmallBody>
												{t(
													'pages.simulateurs.location-de-logement-meublé.questions.regime.options.estimation',
													'Estimation des cotisations'
												)}{' '}
												: <strong>{formatMontant(résultat.cotisations)}</strong>
											</SmallBody>
										) : null,
								})
							)}
						</>
					}
				/>
			)}
		</RadioCardGroup>
	)
}
RegimeCotisationQuestion._tag = 'QuestionFournie'
RegimeCotisationQuestion.id = 'regime-cotisation'
RegimeCotisationQuestion.libellé =
	'Quel régime de cotisation souhaitez-vous simuler ?'
RegimeCotisationQuestion.applicable = (situation) =>
	O.isSome(situation.recettes)
RegimeCotisationQuestion.répondue = (situation) =>
	O.isSome(situation.regimeCotisation)
