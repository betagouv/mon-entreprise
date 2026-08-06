import { TFunction } from 'i18next'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import RuleLink from '@/components/RuleLink'
import { StatutTag } from '@/components/StatutTag'
import {
	CatégorieComparée,
	ÉlémentComparé,
	MontantDocumenté,
	QuantitéDocumentée,
	useComparateur,
} from '@/contextes/comparateur'
import { Grid, HelpIcon, StatusCard, Ul } from '@/design-system'
import {
	arrondirÀLEuro,
	isMontant,
	isMontantRécurrent,
	MontantRécurrent,
	montantToString,
} from '@/domaine/Montant'
import {
	arrondirÀLUnité,
	isQuantité,
	quantitéToString,
} from '@/domaine/Quantite'

export const getGridSizes = (numberOptions: number, total: number) => {
	return {
		xs: 12,
		// sm: total === 2 ? 6 : 12,
		lg: (12 / total) * numberOptions,
	}
}

type Props<K extends CatégorieComparée> = {
	catégorieComparée: K
	élémentComparé: ÉlémentComparé<K>
	convertisseur?: (m: MontantRécurrent) => MontantRécurrent
	displayedUnit?: string
	libellé?: ReactNode | string
	élémentComparéSecondaire?: ÉlémentComparé<K>
	libelléSecondaire?: ReactNode | string
	warning?: (
		résultatModèle: ReturnType<typeof useComparateur>['comparaison'][number]
	) => ReactNode
	footer?: (
		résultatModèle: ReturnType<typeof useComparateur>['comparaison'][number]
	) => ReactNode
}

export const ComparaisonÉlément = <K extends CatégorieComparée>({
	catégorieComparée,
	élémentComparé,
	convertisseur = (x) => x,
	displayedUnit,
	libellé,
	élémentComparéSecondaire,
	libelléSecondaire,
	warning,
	footer,
}: Props<K>) => {
	const { comparaison } = useComparateur()
	const { t } = useTranslation()

	const formattedValue = <
		T extends
			| MontantDocumenté
			| QuantitéDocumentée
			| ((t: TFunction) => string),
	>(
		valeur: T
	): string => {
		if (isMontant(valeur)) {
			const valeurConvertie = isMontantRécurrent(valeur)
				? convertisseur(valeur)
				: valeur

			return montantToString(arrondirÀLEuro(valeurConvertie), displayedUnit)
		}

		if (isQuantité(valeur)) {
			return quantitéToString(arrondirÀLUnité(valeur), displayedUnit)
		}

		return valeur(t)
	}

	return (
		<Grid container spacing={4} as={Ul}>
			{comparaison.map((résultatModèle, index) => {
				const statut = résultatModèle.statut.étiquette

				const catégorie = résultatModèle[catégorieComparée]()
				const valeur = catégorie[élémentComparé as keyof typeof catégorie] as
					| MontantDocumenté
					| QuantitéDocumentée
				const valeurSecondaire = élémentComparéSecondaire
					? (catégorie[élémentComparéSecondaire as keyof typeof catégorie] as
							| MontantDocumenté
							| QuantitéDocumentée)
					: undefined

				const isApplicable = !!valeur

				return (
					<Grid key={index} item as="li" xs={12} lg={12 / comparaison.length}>
						<StatusCard>
							<StatusCard.Étiquette>
								<StatutTag statut={statut} />
							</StatusCard.Étiquette>
							{élémentComparé && (
								<StatusCard.Titre>
									{!isApplicable && (
										<StyledDiv>
											{/* TODO: traduction */}
											<DisabledLabel>Ne s'applique pas</DisabledLabel>
										</StyledDiv>
									)}
									{isApplicable && (
										<StyledDiv>
											<span>
												{formattedValue(valeur)}
												{libellé && ' '}
												{libellé}
											</span>
											<RuleLinkContainer>
												<RuleLink
													documentationPath={statut}
													engine={résultatModèle.engine()}
													dottedName={valeur.documentationRule}
												>
													<HelpIcon />
												</RuleLink>
											</RuleLinkContainer>
											{warning?.(résultatModèle)}
										</StyledDiv>
									)}
								</StatusCard.Titre>
							)}
							{isApplicable && valeurSecondaire && (
								<StatusCard.ValeurSecondaire>
									{formattedValue(valeurSecondaire)}
									{libelléSecondaire && ' '}
									{libelléSecondaire}
								</StatusCard.ValeurSecondaire>
							)}
							{footer?.(résultatModèle) && (
								<StatusCard.Action>
									{footer?.(résultatModèle)}
								</StatusCard.Action>
							)}
						</StatusCard>
					</Grid>
				)
			})}
		</Grid>
	)
}

const RuleLinkContainer = styled.div`
	display: inline-flex;
	align-items: center;
	a {
		display: inline-flex;
		align-items: center;
	}
	&:hover {
		opacity: 0.8;
	}
`

const DisabledLabel = styled.span`
	color: ${({ theme }) => theme.colors.extended.grey[800]}!important;
	font-size: ${({ theme }) => theme.fontSizes.xl};
	font-weight: 700;
	font-style: italic;
	margin: 0 !important;
`

const StyledDiv = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	column-gap: ${({ theme }) => theme.spacings.xs};
`
