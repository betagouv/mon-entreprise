import { Either, pipe } from 'effect'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	compareApplicabilitéDesRégimes,
	estSituationValide,
	RegimeCotisation,
	RégimeTag,
	RésultatApplicabilité,
	useEconomieCollaborative,
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

export const ComparateurRégimesCards = () => {
	const { t } = useTranslation()
	const { situation } = useEconomieCollaborative()

	const résultats = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(compareApplicabilitéDesRégimes),
		O.getOrElse((): RésultatApplicabilité[] => [])
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

const RégimeCard = ({ résultat }: { résultat: RésultatApplicabilité }) => {
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
		Either.isRight(résultat.résultat) && résultat.résultat.right
	const estNonApplicable =
		Either.isRight(résultat.résultat) && !résultat.résultat.right
	const estSousConditions = Either.isLeft(résultat.résultat)

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
						<Strong>
							{t(
								'pages.simulateurs.location-de-logement-meublé.comparateur.sous-conditions',
								'Applicable sous conditions'
							)}
						</Strong>
					)}
				</SmallBody>
			</StatusCard.ValeurSecondaire>

			{estApplicable && (
				<StatusCard.Complément>
					<Ul
						style={{
							display: 'flex',
							flex: '1',
							marginBottom: '0',
							flexDirection: 'column',
						}}
					>
						<Li>
							{résultat.régime === RegimeCotisation.regimeGeneral &&
								t(
									'pages.simulateurs.location-de-logement-meublé.questions.regime.options.régime-général.description',
									'Comme pour un salarié.'
								)}
							{résultat.régime === RegimeCotisation.microEntreprise &&
								t(
									'pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.description',
									"Vous payez un pourcentage de votre chiffre d'affaires."
								)}
							{résultat.régime === RegimeCotisation.travailleurIndependant &&
								t(
									'pages.simulateurs.location-de-logement-meublé.questions.regime.options.travailleur-indépendant.description',
									'Vous payez des cotisations sociales sur votre bénéfice.'
								)}
						</Li>
					</Ul>
				</StatusCard.Complément>
			)}
		</StatusCard>
	)
}
