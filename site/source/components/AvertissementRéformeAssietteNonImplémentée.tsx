import { Trans, useTranslation } from 'react-i18next'

import { Body, Emoji, Link, Message, Strong } from '@/design-system'

export default function AvertissementRéformeAssietteNonImplémentée() {
	const { t } = useTranslation()

	return (
		<Message type="error">
			<Body>
				<Emoji emoji="⚠️" />{' '}
				<Strong>
					<Trans i18nKey="pages.simulateurs.indépendant.warning.réforme.texte">
						La{' '}
						<Link
							href="https://www.urssaf.fr/accueil/independant/comprendre-payer-cotisations/reforme-cotisations-independants.html"
							aria-label={t(
								'pages.simulateurs.indépendant.warning.réforme.aria-label',
								'Lire la page dédiée à la réforme de l’assiette et du barème des cotisations sur le site de l’Urssaf, nouvelle fenêtre'
							)}
						>
							réforme de l’assiette et du barème des cotisations
						</Link>{' '}
						n'est pas encore implémentée sur ce simulateur.
					</Trans>
				</Strong>
			</Body>
		</Message>
	)
}
