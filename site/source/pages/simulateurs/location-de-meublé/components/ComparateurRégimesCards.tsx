import { Array, Order, pipe } from 'effect'
import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	compareRégimes,
	estSituationValide,
	isCotisationsEnabled,
	RaisonInapplicabilité,
	RegimeCotisation,
	RégimeTag,
	RésultatRégimeApplicable,
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
import { toString as formatMontant } from '@/domaine/Montant'

import { getGridSizes } from '../../comparaison-statuts/components/DetailsRowCards'

export const ComparateurRégimesCards = () => {
	const { t } = useTranslation()
	const { situation } = useEconomieCollaborative()

	const comparaisonRégimes = pipe(
		situation,
		O.liftPredicate(estSituationValide),
		O.map(compareRégimes)
	)

	const résultats = pipe(
		comparaisonRégimes,
		O.getOrElse((): ReturnType<typeof compareRégimes> => [])
	)

	const orderByCotisations = pipe(
		Order.number,
		Order.mapInput((r: RésultatRégimeApplicable) => r.cotisations.valeur)
	)

	const meilleurRégime = isCotisationsEnabled
		? pipe(
				résultats,
				Array.filter((r): r is RésultatRégimeApplicable => r.applicable),
				Array.sort(orderByCotisations),
				Array.head,
				O.map((r) => r.régime),
				O.getOrNull
		  )
		: null

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
						<RégimeCard
							résultat={résultat}
							estMeilleurRégime={meilleurRégime === résultat.régime}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	)
}

const RégimeCard = ({
	résultat,
	estMeilleurRégime,
}: {
	résultat: ReturnType<typeof compareRégimes>[0]
	estMeilleurRégime: boolean
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

	return (
		<StatusCard
			isBestOption={estMeilleurRégime}
			nonApplicable={!résultat.applicable}
		>
			<StatusCard.Étiquette>
				<RégimeTag régime={résultat.régime} />
			</StatusCard.Étiquette>

			<StatusCard.Titre>{getRégimeLibellé(résultat.régime)}</StatusCard.Titre>

			{résultat.applicable ? (
				isCotisationsEnabled ? (
					<StatusCard.ValeurSecondaire>
						<span>{formatMontant(résultat.cotisations)}</span>
						<span> de cotisations</span>
					</StatusCard.ValeurSecondaire>
				) : (
					<StatusCard.ValeurSecondaire>
						<SmallBody>
							<Strong>
								{t(
									'pages.simulateurs.location-de-logement-meublé.comparateur.applicable',
									'Applicable'
								)}
							</Strong>
						</SmallBody>
					</StatusCard.ValeurSecondaire>
				)
			) : (
				<StatusCard.ValeurSecondaire>
					<SmallBody>
						<Strong>
							{t(
								'pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable',
								'Non applicable'
							)}
						</Strong>{' '}
						{RaisonInapplicabilité.estTypeDeDuréeIncompatible(
							résultat.raisonDeNonApplicabilité
						) ||
						RaisonInapplicabilité.estChambreDHôte(
							résultat.raisonDeNonApplicabilité
						)
							? t(
									'pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable-raison-type-location',
									'pour ce type de location'
							  )
							: t(
									'pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable-raison',
									'avec vos recettes actuelles'
							  )}
					</SmallBody>
				</StatusCard.ValeurSecondaire>
			)}

			{résultat.applicable && (
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
