import { useTranslation } from 'react-i18next'

import { type RéponseManquante } from '@/contextes/économie-collaborative'
import { Body, H3, Li, Message, Spacing, Ul } from '@/design-system'

import { getLibelléInfoManquante } from '../getLibelléInfoManquante'
import { ComparateurRégimesCards } from './ComparateurRégimesCards'

export const BlocAffiliationIndéterminée = ({
	réponsesManquantes,
}: {
	réponsesManquantes: RéponseManquante[]
}) => {
	const { t } = useTranslation()

	return (
		<>
			<Spacing lg />
			<Message type="secondary">
				<H3>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.indéterminée.titre',
						"L'obligation d'affiliation dépend de votre situation"
					)}
				</H3>
				<Body>
					{t(
						'pages.simulateurs.location-de-logement-meublé.affiliation.indéterminée.texte',
						'Pour déterminer si vous devez vous affilier, nous avons besoin de connaître :'
					)}
				</Body>
				<Ul data-testid="liste-informations-manquantes">
					{réponsesManquantes.map((réponse) => (
						<Li key={réponse}>{getLibelléInfoManquante(t, réponse)}</Li>
					))}
				</Ul>
			</Message>
			<ComparateurRégimesCards />
		</>
	)
}
