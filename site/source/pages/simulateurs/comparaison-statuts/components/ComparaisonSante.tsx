import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, CircledPlusIcon, H4, Strong } from '@/design-system'
import { toEurosParJour } from '@/domaine/MontantRecurrent'
import { quantitéToString } from '@/domaine/Quantite'

import { ComparaisonÉlément } from './ComparaisonElement'
import WarningTooltip from './WarningTooltip'

export const ComparaisonSanté = () => {
	const { t } = useTranslation()

	return (
		<>
			<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.body">
				<BodyNoBottomMargin>
					Tous les statuts vous ouvrent le droit au{' '}
					<Strong>remboursement des soins.</Strong>
				</BodyNoBottomMargin>
				<BodyNoMargin>
					Pour tous les statuts, il est conseillé de souscrire à une{' '}
					<Strong>prévoyance complémentaire (mutuelle)</Strong> pour améliorer
					le remboursement des frais de santé.
				</BodyNoMargin>
			</Trans>

			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.santé.arrêt.h4',
					'Arrêt maladie'
				)}
			</H4>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.body">
					Pour tous les statuts, vous aurez un{' '}
					<Strong>délai de carence de 3 jours</Strong>. En cas d’arrêt maladie,
					l’assurance maladie vous versera :
				</Trans>
			</Body>

			<ComparaisonÉlément
				catégorieComparée="maladie"
				élémentComparé="indemnitésArrêtMaladie"
				convertisseur={toEurosParJour}
				warning={(résultatModèle) =>
					!résultatModèle.maladie().indemnitésArrêtMaladie.valeur && (
						<WarningTooltip
							tooltip={
								<span
									style={{
										fontWeight: 'normal',
									}}
								>
									<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.warning">
										Votre <Strong>rémunération</Strong> est{' '}
										<Strong>trop faible</Strong> pour bénéficier d’arrêt
										maladie.
									</Trans>
								</span>
							}
						/>
					)
				}
				footer={(résultatModèle) => {
					const délaiAttente = quantitéToString(
						résultatModèle.maladie().délaiAttente
					)

					return (
						résultatModèle.maladie().indemnitésArrêtMaladie.valeur && (
							<StyledDiv>
								<CircledPlusIcon />
								<BodyNoMargin>
									<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.footer">
										Pour y prétendre, vous devez avoir cotisé au moins{' '}
										<Strong>{{ délaiAttente }}</Strong>
									</Trans>
								</BodyNoMargin>
							</StyledDiv>
						)
					)
				}}
			/>

			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.santé.atmp.h4',
					'Accident du travail et maladie professionnelle'
				)}
			</H4>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.atmp.body">
					En cas d’<Strong>accident du travail</Strong>, de{' '}
					<Strong>maladie professionnelle</Strong> ou d’un{' '}
					<Strong>accident sur le trajet domicile-travail</Strong>, vous
					recevrez une indemnisation de&nbsp;:
				</Trans>
			</Body>

			<ComparaisonÉlément
				catégorieComparée="maladie"
				élémentComparé="indemnitésATMP"
				élémentComparéSecondaire="indemnitésATMPLongTerme"
				convertisseur={toEurosParJour}
				libelléSecondaire={t(
					'pages.simulateurs.comparaison-statuts.items.santé.atmp.secondary-label',
					'à partir du 29ème jour'
				)}
			/>
		</>
	)
}

const StyledDiv = styled.div`
	display: flex;
	align-items: center;
	column-gap: ${({ theme }) => theme.spacings.md};

	svg {
		width: 2.5rem;
	}
`

const BodyNoBottomMargin = styled(Body)`
	margin-bottom: 0;
`
const BodyNoMargin = styled(Body)`
	margin: 0;
`
