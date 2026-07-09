import { useTranslation } from 'react-i18next'

import {
	ABATTEMENT_REGIME_GENERAL,
	PLAFOND_REGIME_GENERAL,
} from '@/contextes/économie-collaborative'
import { Tableau, Valeur } from '@/design-system'
import { montantToString } from '@/domaine/Montant'

export const TableauSeuils = () => {
	const { t } = useTranslation()

	return (
		<Tableau>
			<thead>
				<tr>
					<th>
						{t(
							'pages.simulateurs.location-de-logement-meublé.documentation.seuils.type',
							'Type de location'
						)}
					</th>
					<th>
						{t(
							'pages.simulateurs.location-de-logement-meublé.documentation.seuils.plafond',
							'Plafond annuel'
						)}
					</th>
					<th>
						{t(
							'pages.simulateurs.location-de-logement-meublé.documentation.seuils.abattement',
							'Abattement forfaitaire'
						)}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						{t(
							'pages.simulateurs.location-de-logement-meublé.documentation.seuils.classique',
							'Location meublée classique'
						)}
					</td>
					<td>
						<Valeur couleur="primary">
							{montantToString(PLAFOND_REGIME_GENERAL)}
						</Valeur>
					</td>
					<td>
						<strong>{ABATTEMENT_REGIME_GENERAL * 100}%</strong>
					</td>
				</tr>
				<tr>
					<td>
						{t(
							'pages.simulateurs.location-de-logement-meublé.documentation.seuils.tourisme',
							'Location meublée de tourisme classée'
						)}
					</td>
					<td>
						<Valeur couleur="primary"></Valeur>
					</td>
					<td>
						<strong>{0}%</strong>
					</td>
				</tr>
			</tbody>
		</Tableau>
	)
}
