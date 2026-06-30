import * as O from 'effect/Option'
import { useTranslation } from 'react-i18next'

import {
	abattementSécuritéSociale,
	décomposeCotisationMaladie,
	estSituationValide,
	joursDansAnnée,
	plafondSécuritéSociale,
	useFrontalierSuisse,
} from '@/contextes/frontalier-suisse'
import { Info, Tableau, Valeur, ValeurImportante } from '@/design-system'
import { arrondirÀLEuro, Montant, montantToString } from '@/domaine/Montant'

export const Décomposition = () => {
	const { situation } = useFrontalierSuisse()
	const { t } = useTranslation()

	if (!estSituationValide(situation)) {
		return (
			<Info>
				{t(
					'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.incomplet',
					'Renseignez le simulateur (date d’affiliation et revenus) pour voir le calcul appliqué à votre situation.'
				)}
			</Info>
		)
	}

	const détail = décomposeCotisationMaladie(situation)
	const plafond = plafondSécuritéSociale(détail.annéeRevenus)
	const abattement = abattementSécuritéSociale(détail.annéeRevenus)
	const joursAnnée = joursDansAnnée(détail.annéeRevenus)
	const euro = (montant: Montant) => montantToString(arrondirÀLEuro(montant))

	return (
		<Tableau>
			<thead>
				<tr>
					<th>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.étape',
							'Étape'
						)}
					</th>
					<th>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.calcul',
							'Calcul'
						)}
					</th>
					<th>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.montant',
							'Montant'
						)}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.assiette',
							'Assiette retenue'
						)}
					</td>
					<td>
						{euro(détail.salaires)} + {euro(détail.autresRevenus)}
					</td>
					<td>
						<Valeur couleur="primary">{euro(détail.assiette)}</Valeur>
					</td>
				</tr>
				<tr>
					<td>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.abattement',
							'Abattement'
						)}
					</td>
					<td>
						25{'\u00A0'}% × PASS {détail.annéeRevenus} ({euro(plafond)})
					</td>
					<td>
						<Valeur couleur="primary">{euro(abattement)}</Valeur>
					</td>
				</tr>
				<tr>
					<td>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.base',
							'Base de cotisation'
						)}
					</td>
					<td>
						{euro(détail.assiette)} − {euro(abattement)}
					</td>
					<td>
						<Valeur couleur="primary">{euro(détail.base)}</Valeur>
					</td>
				</tr>
				<tr>
					<td>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.annuelle',
							'Cotisation annuelle'
						)}
					</td>
					<td>
						{euro(détail.base)} × 8{'\u00A0'}%
					</td>
					<td>
						<ValeurImportante>{euro(détail.annuel)}</ValeurImportante>
					</td>
				</tr>
				<tr>
					<td>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.mensuelle',
							'Cotisation mensuelle'
						)}
					</td>
					<td>{euro(détail.annuel)} ÷ 12</td>
					<td>
						<ValeurImportante>{euro(détail.mensuel)}</ValeurImportante>
					</td>
				</tr>
				{O.isSome(détail.prorataAnnéePartielle) && (
					<tr>
						<td>
							{t(
								'pages.simulateurs.cotisation-maladie-frontalier-suisse.documentation.décomposition.prorata',
								'Cotisation {{année}} au prorata',
								{ année: détail.annéeRevenus }
							)}
						</td>
						<td>
							{euro(détail.annuel)} × {détail.joursAffiliation} ÷ {joursAnnée}
						</td>
						<td>
							<ValeurImportante>
								{euro(détail.prorataAnnéePartielle.value)}
							</ValeurImportante>
						</td>
					</tr>
				)}
			</tbody>
		</Tableau>
	)
}
