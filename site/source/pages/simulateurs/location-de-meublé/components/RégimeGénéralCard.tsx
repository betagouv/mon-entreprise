import { useTranslation } from 'react-i18next'

import {
	RegimeCotisation,
	RégimeTag,
	type RésultatApplicabilitéParRégime,
} from '@/contextes/économie-collaborative'
import { Li, Link, StatusCard, Strong, Ul } from '@/design-system'

import {
	estApplicableSurRecettesCourteDurée,
	getStatus,
	StatutApplicabilité,
} from './StatutApplicabilité'

interface RégimeGénéralCardProps {
	résultat: RésultatApplicabilitéParRégime
}

export const RégimeGénéralCard = ({ résultat }: RégimeGénéralCardProps) => {
	const { t } = useTranslation()

	const status = getStatus(résultat.résultat)
	const surRecettesCourteDuréeUniquement = estApplicableSurRecettesCourteDurée(
		résultat.résultat
	)

	return (
		<StatusCard status={status}>
			<StatusCard.Étiquette>
				<RégimeTag régime={RegimeCotisation.regimeGeneral} />
			</StatusCard.Étiquette>

			<StatusCard.Titre>
				{t(
					'pages.simulateurs.location-de-logement-meublé.régimes.régime-général.libellé',
					'Régime général simplifié'
				)}
			</StatusCard.Titre>

			<StatusCard.ValeurSecondaire>
				<StatutApplicabilité résultat={résultat.résultat} />
			</StatusCard.ValeurSecondaire>

			{surRecettesCourteDuréeUniquement && (
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
							<Strong>
								{t(
									'pages.simulateurs.location-de-logement-meublé.comparateur.sur-recettes-courte-durée',
									'Sur les recettes de courte durée uniquement'
								)}
							</Strong>
						</Li>
					</Ul>
				</StatusCard.Complément>
			)}

			<StatusCard.Action>
				<Link href="https://www.urssaf.fr/accueil/services/economie-collaborative.html">
					{t(
						'pages.simulateurs.location-de-logement-meublé.régimes.régime-général.lien',
						'En savoir plus sur Urssaf.fr'
					)}
				</Link>
			</StatusCard.Action>
		</StatusCard>
	)
}
