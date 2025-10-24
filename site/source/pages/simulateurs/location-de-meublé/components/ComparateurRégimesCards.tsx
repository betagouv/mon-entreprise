import { Array, Order, pipe } from 'effect'
import * as O from 'effect/Option'
import { Trans, useTranslation } from 'react-i18next'

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

	const gridSizes = getGridSizes(1, 4)

	return (
		<div>
			<Spacing lg />
			<Grid container spacing={4} as={Ul}>
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
			case RegimeCotisation.pasDAffiliation:
				return t(
					'pages.simulateurs.location-de-logement-meublé.régimes.pas-d-affiliation.libellé',
					"Pas d'affiliation"
				)
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
		<StatusCard isBestOption={estMeilleurRégime}>
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
								<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.comparateur.applicable">
									Applicable
								</Trans>
							</Strong>
						</SmallBody>
					</StatusCard.ValeurSecondaire>
				)
			) : (
				<StatusCard.ValeurSecondaire>
					<SmallBody>
						<Strong>
							<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable">
								Non applicable
							</Trans>
						</Strong>{' '}
						{RaisonInapplicabilité.estTypeDeLocationIncompatible(
							résultat.raisonDeNonApplicabilité
						) ? (
							<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable-raison-type-location">
								pour ce type de location
							</Trans>
						) : (
							<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.comparateur.non-applicable-raison">
								avec vos recettes actuelles
							</Trans>
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
							{résultat.régime === RegimeCotisation.pasDAffiliation && (
								<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.pas-d-affiliation.description">
									Vous n'êtes pas obligé de vous affilier et ne payez pas de
									cotisations.
								</Trans>
							)}
							{résultat.régime === RegimeCotisation.regimeGeneral && (
								<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.régime-général.description">
									Comme pour un salarié.
								</Trans>
							)}
							{résultat.régime === RegimeCotisation.microEntreprise && (
								<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.micro-entrepreneur.description">
									Vous payez un pourcentage de votre chiffre d'affaires.
								</Trans>
							)}
							{résultat.régime === RegimeCotisation.travailleurIndependant && (
								<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.questions.regime.options.travailleur-indépendant.description">
									Vous payez des cotisations sociales sur votre bénéfice.
								</Trans>
							)}
						</Li>
					</Ul>
				</StatusCard.Complément>
			)}
		</StatusCard>
	)
}
