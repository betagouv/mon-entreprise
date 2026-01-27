import { Trans, useTranslation } from 'react-i18next'

import { Body, Emoji, Link, Strong } from '@/design-system'

export default function AvertissementRéformeRGDUNonImplémentée() {
	const { t } = useTranslation()

	return (
		<Body>
			<Emoji emoji="⚠️" />{' '}
			<Strong>
				<Trans i18nKey="pages.simulateurs.réduction-générale.warning.réforme.texte">
					La{' '}
					<Link
						href="https://www.urssaf.fr/accueil/actualites/informations-nouvelle-annee.html"
						aria-label={t(
							'pages.simulateurs.réduction-générale.warning.réforme.aria-label',
							'En savoir plus sur la réduction générale dégressive (RGDU) sur le site de l’Urssaf, nouvelle fenêtre'
						)}
					>
						réduction générale dégressive (RGDU)
					</Link>{' '}
					n'est pas encore implémentée sur ce simulateur.
				</Trans>
			</Strong>
		</Body>
	)
}
