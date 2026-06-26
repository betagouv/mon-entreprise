import { Option } from 'effect'
import { useTranslation } from 'react-i18next'

import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import {
	annéeDeCotisation,
	calculeCotisationMaladie,
	SituationFrontalierSuisseValide,
} from '@/contextes/frontalier-suisse'
import { Link } from '@/design-system'
import { arrondirÀLEuro } from '@/domaine/Montant'
import { useSitePaths } from '@/sitePaths'

export const RésultatCotisation = ({
	situation,
}: {
	situation: SituationFrontalierSuisseValide
}) => {
	const { t, i18n } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	const dateAffiliation = situation.dateAffiliation.value
	const année = annéeDeCotisation(dateAffiliation)
	const cotisation = calculeCotisationMaladie(situation)

	const documentationUrl =
		absoluteSitePaths.simulateurs['cotisation-maladie-frontalier-suisse'] +
		'/documentation'

	const dateAffiliationFormatée = dateAffiliation.toLocaleDateString(
		i18n.language === 'en' ? 'en-GB' : 'fr-FR'
	)

	return (
		<>
			<ObjectifDeSimulation
				id="frontalier-suisse-cotisation-annuelle"
				titre={
					<Link to={documentationUrl}>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.annuel',
							'Cotisation maladie annuelle'
						)}
					</Link>
				}
				valeur={Option.some(arrondirÀLEuro(cotisation.annuel))}
			/>
			<ObjectifDeSimulation
				id="frontalier-suisse-cotisation-mensuelle"
				titre={
					<Link to={documentationUrl}>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.mensuel',
							'Cotisation maladie mensuelle'
						)}
					</Link>
				}
				valeur={Option.some(arrondirÀLEuro(cotisation.mensuel))}
			/>
			{Option.isSome(cotisation.prorataPremièreAnnée) && (
				<ObjectifDeSimulation
					id="frontalier-suisse-cotisation-prorata"
					titre={
						<Link to={documentationUrl}>
							{t(
								'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.prorata.titre',
								'Cotisation {{année}} au prorata',
								{ année }
							)}
						</Link>
					}
					valeur={Option.some(
						arrondirÀLEuro(cotisation.prorataPremièreAnnée.value)
					)}
					description={t(
						'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.prorata.message',
						'première année, à partir du {{date}}',
						{
							date: dateAffiliationFormatée,
							interpolation: { escapeValue: false },
						}
					)}
					small
				/>
			)}
		</>
	)
}
