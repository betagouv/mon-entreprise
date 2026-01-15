import { useTranslation } from 'react-i18next'

import { Body, H3, Link, Message, Spacing } from '@/design-system'

export const BlocAffiliationNonObligatoire = () => {
	const { t } = useTranslation()

	return (
		<>
			<Spacing lg />
			<Message type="info">
				<H3>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.non-obligatoire.titre',
						"Pas d'affiliation obligatoire"
					)}
				</H3>
				<Body>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.non-obligatoire.texte',
						"Vous n'êtes pas obligé de vous affilier à un régime de sécurité sociale et ne payez pas de cotisations sociales."
					)}
				</Body>
				<Body>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.non-obligatoire.affiliation-volontaire',
						'Vous pouvez toutefois choisir de vous affilier volontairement.'
					)}
				</Body>
				<Spacing sm />
				<Link href="https://www.urssaf.fr/accueil/services/economie-collaborative.html">
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.non-obligatoire.lien-urssaf',
						"En savoir plus sur les régimes d'économie collaborative"
					)}
				</Link>
				<Spacing sm />
			</Message>
		</>
	)
}
