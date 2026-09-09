import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import {
	baseParagraphStyle,
	Body,
	HelpButtonWithPopover,
	Li,
	Ul,
} from '@/design-system'

export const StyledTable = styled.table`
	${baseParagraphStyle}
	font-size: 0.85em;
	text-align: center;
	border-collapse: collapse;
	display: block;
	overflow-y: auto;

	tr:nth-child(2n + 3) {
		background: var(--lightestColor);
	}

	td,
	th {
		padding: 0.5rem;
		border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};
	}
	th {
		font-weight: initial;
	}
`

export function ExplicationsResultatFiscal() {
	return (
		<HelpButtonWithPopover
			title="Quelles exonérations inclure ?"
			type="aide"
			bigPopover
		>
			<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.intro">
				<Body>
					Pour calculer le montant du résultat fiscal avant déduction des
					exonérations et des charges sociales à indiquer dans ce simulateur,
					vous pouvez utiliser votre liasse fiscale, en reprenant les montants
					indiqués dans les lignes fiscales du tableau ci-dessous, en fonction
					de votre situation (imposition au réel normal ou au réel simplifié).
				</Body>
				<Body>L’opération à effectuer est la suivante :</Body>
				<Ul>
					<Li>
						Déterminez le résultat fiscal dans votre liasse, sans déduire le
						montant de vos cotisations et contributions sociales aux régimes
						obligatoires de sécurité sociale. Prenez le résultat fiscal
						correspondant <strong>(1)</strong>
					</Li>
					<Li>
						Ajoutez les exonérations <strong>(2)</strong>
					</Li>
				</Ul>
			</Trans>

			<StyledTable role="table">
				<caption className="sr-only">
					<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.tableCaption">
						Tableau affichant les lignes de votre liasse fiscale associées aux
						exonérations fiscales en place pour chaque type d’activité. La
						première colonne affiche les différents types d’activité (BIC, BNC).
						La deuxième colonne indique les lignes de votre liasse fiscale qui
						vous permettent de déterminer votre résultat fiscal, et ce pour
						chaque type d’activité. Les autres colonnes affichent les
						exonérations en place ainsi que les lignes de liasse fiscale ou
						ajouter vos exonérations et ce pour chaque type d’activité.
					</Trans>
				</caption>
				<thead>
					<tr>
						<th scope="col">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.1">
								Régime fiscal
							</Trans>
						</th>
						<th scope="col">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.2">
								Résultat fiscal <strong>(1)</strong>
							</Trans>
						</th>
						<th scope="col">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.3">
								Exonérations liées aux zones / activités
							</Trans>
						</th>
						<th scope="col">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.4">
								Exonérations Madelin et plan d’épargne retraite
							</Trans>
						</th>
						<th scope="col">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.5">
								Exonérations de plus-values à court terme
							</Trans>
						</th>
						<th scope="col">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.6">
								Suramortissement productif
							</Trans>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.explications.th.7">
								BIC réel normal
							</Trans>
						</th>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Ligne XN (bénéfice) Ligne XO (déficit)
						</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Lignes K9 / L6 / ØV / PP / L2 / 1F / PC / L5 / PA / XC / PB
						</td>
						<td>
							<strong>2053-SD</strong>
							<br />
							Lignes A7 et A8
						</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Ligne XG (montant inclus)
						</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Lignes X9 et YA
						</td>
					</tr>
					<tr>
						<th scope="row">BIC réel simplifié</th>
						<td>
							<strong>2033-B-SD</strong>
							<br />
							Ligne 370 (bénéfice) Ligne 372 (déficit)
						</td>
						<td>
							<strong>2033 B-SD</strong>
							<br />
							Lignes 986 / 127 / 991 / 345 / 992 / 987 / 989 / 138 / 990 / 993
						</td>
						<td>
							<strong>2033-SD</strong>
							<br />
							Lignes 325 et 327
						</td>
						<td>
							<strong>2033 B-SD</strong>
							<br />
							Ligne 350 (montant inclus)
						</td>
						<td>
							<strong>2033 B-SD</strong>
							<br />
							Lignes 655 et 643
						</td>
					</tr>
					<tr>
						<th scope="row">BNC déclaration contrôlée</th>
						<td>
							<strong>2035-B-SD</strong>
							<br />
							Ligne CP (bénéfice) Ligne CR (déficit)
						</td>
						<td>
							<strong>2035-B-SD </strong>
							<br />
							Lignes CS / AW / CU / CI / AX / CQ
						</td>
						<td>
							<strong>2035-A-SD </strong>
							<br />
							Lignes BZ et BU
						</td>
						<td>
							<strong>2035-A-SD</strong>
							<br />
							Ligne CL (montant inclus)
						</td>
						<td></td>
					</tr>
				</tbody>
			</StyledTable>
		</HelpButtonWithPopover>
	)
}
