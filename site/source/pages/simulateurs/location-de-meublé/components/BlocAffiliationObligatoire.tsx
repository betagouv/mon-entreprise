import { useTranslation } from 'react-i18next'

import { Body, H3, Message, Spacing } from '@/design-system'

import { ComparateurRégimesCards } from './ComparateurRégimesCards'

export const BlocAffiliationObligatoire = () => {
	const { t } = useTranslation()

	return (
		<>
			<Spacing lg />
			<Message type="info">
				<H3>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.obligatoire.titre',
						'Affiliation obligatoire'
					)}
				</H3>
				<Body>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.obligatoire.texte',
						'Vous devez obligatoirement déclarer vos revenus et des cotisations sociales sont dues.'
					)}
				</Body>
			</Message>
			<ComparateurRégimesCards />
		</>
	)
}
