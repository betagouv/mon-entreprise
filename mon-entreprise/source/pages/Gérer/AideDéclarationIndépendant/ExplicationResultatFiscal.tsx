import { Explicable } from 'Components/conversation/Explicable'
import { H2 } from 'DesignSystem/typography/heading'

export function ExplicationsResultatFiscal() {
	return (
		<Explicable>
			<>
				<H2>Quelles exonérations inclure ?</H2>
				<p>
					Pour calculer le montant du résultat fiscal avant déduction des
					exonérations et des charges sociales à indiquer dans ce simulateur,
					vous pouvez utiliser votre liasse fiscale, en reprenant les montants
					indiqués dans les lignes fiscales du tableau ci-dessous, en fonction
					de votre situation (imposition au réel normal ou au réel simplifié).
				</p>
				<p>L’opération à effectuer est la suivante :</p>
				<ul>
					<li>
						Déterminez le résultat fiscal dans votre liasse, sans déduire le
						montant de vos cotisations et contributions sociales aux régimes
						obligatoires de sécurité sociale. Prenez le résultat fiscal
						correspondant <strong>(1)</strong>
					</li>
					<li>
						Ajoutez les exonérations <strong>(2)</strong>
					</li>
				</ul>
				<table
					css={`
						font-size: 0.85em;
						text-align: center;

						tr:nth-child(2n + 3) {
							background: var(--lightestColor);
						}

						td {
							padding: 0.5rem;
						}
					`}
				>
					<tr>
						<td></td>
						<td></td>
						<td className="ui__ light-bg" colSpan={4}>
							Exonérations <strong>(2)</strong>
						</td>
					</tr>
					<tr>
						<td></td>
						<td className="ui__ light-bg">
							Résultat fiscal <strong>(1)</strong>
						</td>
						<td className="ui__ light-bg notice">
							Exonérations liées aux zones / activités
						</td>
						<td className="ui__ light-bg notice">
							Exonérations Madelin et plan d’épargne retraite
						</td>
						<td className="ui__ light-bg notice">
							Exonérations de plus-values à court terme
						</td>
						<td className="ui__ light-bg notice">Suramortissement productif</td>
					</tr>
					<tr>
						<td>BIC réel normal</td>
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
						<td>BIC réel simplifié</td>
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
						<td>BNC déclaration contrôlée</td>
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
				</table>
			</>
		</Explicable>
	)
}
