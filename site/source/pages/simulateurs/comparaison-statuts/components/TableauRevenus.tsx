import { Option } from 'effect'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { StatutTag } from '@/components/StatutTag'
import { useComparateur } from '@/contextes/comparateur'
import { Strong } from '@/design-system'
import {
	arrondirÀLEuro,
	montantToString,
	toEurosParAn,
} from '@/domaine/Montant'
import { eurosParAn, plus } from '@/domaine/MontantRécurrent'

export function TableauRevenus() {
	const { situation, comparaison } = useComparateur()
	const { t } = useTranslation()

	return (
		<>
			<TableWrapper>
				<StyledTable>
					<caption className="sr-only">
						{t(
							'pages.simulateurs.comparaison-statuts.items.revenus.tableau.caption.1',
							'Tableau affichant le détail du calcul du revenu net pour chaque statut'
						)}
					</caption>
					<thead>
						<RowStatuts comparaison={comparaison} />
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								{t(
									'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.CA',
									'Chiffre d’affaires'
								)}
							</th>
							{comparaison.map((_, index) => (
								<td key={index}>
									{montantToString(
										toEurosParAn(
											Option.getOrElse(situation.chiffreDAffaires, () =>
												eurosParAn(0)
											)
										),
										'€'
									)}
								</td>
							))}
						</tr>
						<tr>
							<th scope="row">
								<Moins />
								{t(
									'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.charges',
									'Charges'
								)}
							</th>
							{comparaison.map((_, index) => (
								<td key={index}>
									<Moins />
									{montantToString(
										toEurosParAn(
											Option.getOrElse(situation.charges, () => eurosParAn(0))
										),
										'€'
									)}
								</td>
							))}
						</tr>
						<tr>
							<th scope="row">
								<Moins />
								{t(
									'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.cotisations',
									'Cotisations'
								)}
							</th>
							{comparaison.map((résultatModèle, index) => (
								<td key={index}>
									<Moins />
									{montantToString(
										arrondirÀLEuro(
											toEurosParAn(résultatModèle.dépenses().cotisations)
										),
										'€'
									)}
								</td>
							))}
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<RowRevenuAvantImpôt comparaison={comparaison} />
						</tr>
					</tfoot>
				</StyledTable>
			</TableWrapper>

			<TableWrapper>
				<StyledTable>
					<caption className="sr-only">
						{t(
							'pages.simulateurs.comparaison-statuts.items.revenus.tableau.caption.2',
							'Tableau affichant le détail du calcul du revenu net après impôt pour chaque statut'
						)}
					</caption>
					<thead className="sr-only">
						<RowStatuts comparaison={comparaison} />
					</thead>
					<tbody>
						<tr className="sr-only">
							<RowRevenuAvantImpôt comparaison={comparaison} />
						</tr>
						<tr>
							<th scope="row">
								<Moins />
								{t(
									'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.impôts',
									'Impôts'
								)}
							</th>
							{comparaison.map((résultatModèle, index) => (
								<td key={index}>
									<Moins />
									{montantToString(
										arrondirÀLEuro(
											toEurosParAn(résultatModèle.dépenses().impôt)
										),
										'€'
									)}
								</td>
							))}
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th scope="row">
								{t(
									'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.revenu-après-impôt',
									'Revenu après impôt'
								)}
							</th>
							{comparaison.map((résultatModèle, index) => (
								<td key={index}>
									<Strong>
										{montantToString(
											arrondirÀLEuro(
												toEurosParAn(
													résultatModèle.revenu().revenuNetAprèsImpôt
												)
											),
											'€'
										)}
									</Strong>
								</td>
							))}
						</tr>
					</tfoot>
				</StyledTable>
			</TableWrapper>
		</>
	)
}

const TableWrapper = styled.div`
	overflow: auto;
`

const StyledTable = styled.table`
	width: 100%;
	font-family: ${({ theme }) => theme.fonts.main};

	th {
		width: 25%;
		text-align: left;
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[200]
				: theme.colors.extended.grey[800]};
	}

	thead th {
		text-align: right;
	}

	td {
		width: 25%;
		text-align: right;
		padding: ${({ theme }) => theme.spacings.xs} 0;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		/* Pseudo-centrage des montants tout en gardant l'alignement des "€" */
		td {
			padding-right: 10%;
		}
		thead th {
			padding-right: 10%;
		}
	}

	tbody th {
		font-weight: normal;
	}

	tfoot {
		position: relative;
	}

	tfoot:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: ${({ theme }) => theme.colors.extended.grey[500]};
	}
	tfoot td,
	tfoot th {
		padding-top: ${({ theme }) => theme.spacings.xs};
	}
`

type Props = {
	comparaison: ReturnType<typeof useComparateur>['comparaison']
}

const RowStatuts = ({ comparaison }: Props) => {
	const { t } = useTranslation()

	return (
		<tr>
			<th className="sr-only">
				{t(
					'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.statut',
					'Type de structure'
				)}
			</th>
			{comparaison.map((résultatModèle, index) => (
				<th scope="col" key={index}>
					<StatutTag statut={résultatModèle.statut.étiquette} />
				</th>
			))}
		</tr>
	)
}

const RowRevenuAvantImpôt = ({ comparaison }: Props) => {
	const { t } = useTranslation()

	return (
		<>
			<th scope="row">
				{t(
					'pages.simulateurs.comparaison-statuts.items.revenus.tableau.th.revenu-avant-impôt',
					'Revenu avant impôt'
				)}
			</th>
			{comparaison.map((résultatModèle, index) => (
				<td key={index}>
					<Strong>
						{montantToString(
							arrondirÀLEuro(
								plus(
									toEurosParAn(résultatModèle.revenu().revenuNetAprèsImpôt),
									toEurosParAn(résultatModèle.dépenses().impôt)
								)
							),
							'€'
						)}
					</Strong>
				</td>
			))}
		</>
	)
}

const Moins = () => {
	const { t } = useTranslation()

	return (
		<StyledSpan
			aria-label={t(
				'pages.simulateurs.comparaison-statuts.items.revenus.tableau.moins',
				'moins'
			)}
		>
			-
		</StyledSpan>
	)
}

const StyledSpan = styled.span`
	margin-right: ${({ theme }) => theme.spacings.xxs};
`
