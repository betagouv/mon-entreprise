import { Either, pipe } from 'effect'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	compareApplicabilitéDesRégimes,
	estSituationValide,
	RegimeCotisation,
	RégimeTag,
	RésultatApplicabilitéParRégime,
	useEconomieCollaborative,
	type RéponseManquante,
} from '@/contextes/économie-collaborative'
import {
	Grid,
	Li,
	SmallBody,
	Spacing,
	StatusCard,
	Strong,
	Ul,
} from '@/design-system'

import { getGridSizes } from '../../comparaison-statuts/components/DetailsRowCards'
import { getLibelléInfoManquante } from '../getLibelléInfoManquante'

export const ComparateurRégimesCards = () => {
	const { t } = useTranslation()
	const { situation } = useEconomieCollaborative()

	const résultats = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(compareApplicabilitéDesRégimes),
		O.getOrElse((): RésultatApplicabilitéParRégime[] => [])
	)

	const gridSizes = getGridSizes(1, 3)

	return (
		<div>
			<Spacing lg />
			<Grid
				container
				spacing={4}
				as={Ul}
				aria-label={t(
					'pages.simulateurs.location-de-logement-meublé.comparateur.aria-label',
					"Comparaison des régimes d'affiliation"
				)}
			>
				{résultats.map((résultat) => (
					<Grid key={résultat.régime} item {...gridSizes} as="li">
						<RégimeCard résultat={résultat} />
					</Grid>
				))}
			</Grid>
		</div>
	)
}

const RégimeCard = ({
	résultat,
}: {
	résultat: RésultatApplicabilitéParRégime
}) => {
	const { t } = useTranslation()

	const getRégimeLibellé = (régime: RegimeCotisation): string => {
		switch (régime) {
			case RegimeCotisation.regimeGeneral:
				return t(
					'pages.simulateurs.location-de-logement-meublé.régimes.régime-général.libellé',
					'Régime général'
				)
			case RegimeCotisation.microEntreprise:
				return t(
					'pages.simulateurs.location-de-logement-meublé.régimes.micro-entreprise.libellé',
					'Auto-entrepreneur'
				)
			case RegimeCotisation.travailleurIndependant:
				return t(
					'pages.simulateurs.location-de-logement-meublé.régimes.travailleur-indépendant.libellé',
					'Travailleur indépendant'
				)
		}
	}

	const estApplicable =
		Either.isRight(résultat.résultat) && résultat.résultat.right.applicable
	const estNonApplicable =
		Either.isRight(résultat.résultat) && !résultat.résultat.right.applicable
	const estSousConditions = Either.isLeft(résultat.résultat)
	const conditionsManquantes = pipe(
		résultat.résultat,
		Either.getLeft,
		O.getOrElse((): RéponseManquante[] => [])
	)
	const estApplicableSurRecettesCourteDuréeUniquement =
		Either.isRight(résultat.résultat) &&
		résultat.résultat.right.applicable &&
		résultat.résultat.right.assiette.type === 'recettes-courte-durée'

	return (
		<StatusCard nonApplicable={estNonApplicable}>
			<StatusCard.Étiquette>
				<RégimeTag régime={résultat.régime} />
			</StatusCard.Étiquette>

			<StatusCard.Titre>{getRégimeLibellé(résultat.régime)}</StatusCard.Titre>

			<StatusCard.ValeurSecondaire>
				<SmallBody>
					{estApplicable && (
						<Strong>
							{t(
								'pages.simulateurs.location-de-logement-meublé.comparateur.applicable',
								'Applicable'
							)}
						</Strong>
					)}
					{estNonApplicable && (
						<Strong>
							{t(
								'pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable',
								'Non applicable'
							)}
						</Strong>
					)}
					{estSousConditions && (
						<>
							<Strong>
								{t(
									'pages.simulateurs.location-de-logement-meublé.comparateur.sous-conditions',
									'Applicable sous conditions'
								)}
							</Strong>
							{conditionsManquantes.length > 0 && (
								<>
									{' : '}
									{conditionsManquantes.map((condition, index) => (
										<span key={condition}>
											{index > 0 &&
												(index === conditionsManquantes.length - 1
													? t(
															'pages.simulateurs.location-de-logement-meublé.comparateur.et',
															' et '
													  )
													: ', ')}
											{getLibelléInfoManquante(t, condition)}
										</span>
									))}
								</>
							)}
						</>
					)}
				</SmallBody>
			</StatusCard.ValeurSecondaire>

			{estApplicable &&
				(estApplicableSurRecettesCourteDuréeUniquement ||
					résultat.régime === RegimeCotisation.microEntreprise) && (
					<StatusCard.Complément>
						<Ul
							style={{
								display: 'flex',
								flex: '1',
								marginBottom: '0',
								flexDirection: 'column',
							}}
						>
							{estApplicableSurRecettesCourteDuréeUniquement && (
								<Li>
									<Strong>
										{t(
											'pages.simulateurs.location-de-logement-meublé.comparateur.sur-recettes-courte-durée',
											'Sur les recettes de courte durée uniquement'
										)}
									</Strong>
								</Li>
							)}
							{résultat.régime === RegimeCotisation.microEntreprise && (
								<Li>
									{t(
										'pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.description',
										"Vous payez un pourcentage de votre chiffre d'affaires."
									)}
								</Li>
							)}
						</Ul>
					</StatusCard.Complément>
				)}
		</StatusCard>
	)
}
