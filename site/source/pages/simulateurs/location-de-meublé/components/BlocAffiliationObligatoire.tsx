import { Trans } from 'react-i18next'

import { Body, H3, Message, Spacing } from '@/design-system'

import { ComparateurRégimesCards } from './ComparateurRégimesCards'

export const BlocAffiliationObligatoire = () => {
	return (
		<>
			<Spacing lg />
			<Message type="info">
				<H3>
					<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.affiliation.obligatoire.titre">
						Votre activité est considérée comme professionnelle
					</Trans>
				</H3>
				<Body>
					<Trans i18nKey="pages.simulateurs.location-de-logement-meublé.affiliation.obligatoire.texte">
						Vous devez obligatoirement déclarer vos revenus et des cotisations
						sociales sont dues. Vous pouvez opter entre plusieurs régimes
						d'affiliation : régime auto-entrepreneur, indépendant ou régime
						général.
					</Trans>
				</Body>
			</Message>
			<ComparateurRégimesCards />
		</>
	)
}
