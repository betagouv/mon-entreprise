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

interface SécuritéSocialeIndépendantsCardProps {
	résultat: RésultatApplicabilitéParRégime
}

export const SécuritéSocialeIndépendantsCard = ({
	résultat,
}: SécuritéSocialeIndépendantsCardProps) => {
	const { t } = useTranslation()

	const status = getStatus(résultat.résultat)
	const surRecettesCourteDuréeUniquement = estApplicableSurRecettesCourteDurée(
		résultat.résultat
	)

	const aUnComplément =
		status === 'applicable' && surRecettesCourteDuréeUniquement

	return (
		<StatusCard status={status}>
			<StatusCard.Étiquette>
				<RégimeTag régime={RegimeCotisation.travailleurIndependant} />
			</StatusCard.Étiquette>

			<StatusCard.Titre>
				{t(
					'pages.simulateurs.location-de-logement-meublé.régimes.travailleur-indépendant.libellé',
					'Travailleur indépendant (hors auto-entrepreneur)'
				)}
			</StatusCard.Titre>

			<StatusCard.ValeurSecondaire>
				<StatutApplicabilité résultat={résultat.résultat} />
			</StatusCard.ValeurSecondaire>

			{aUnComplément && (
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
				<Link href="https://www.urssaf.fr">
					{t(
						'pages.simulateurs.location-de-logement-meublé.régimes.travailleur-indépendant.lien',
						'En savoir plus sur urssaf.fr'
					)}
				</Link>
			</StatusCard.Action>
		</StatusCard>
	)
}
