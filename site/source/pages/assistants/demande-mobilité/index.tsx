import { Trans, useTranslation } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { Intro, Link } from '@/design-system'

export default function PageMobilité() {
	const { t } = useTranslation()

	return (
		<PageHeader
			titre={t(
				'pages.simulateurs.demande-mobilité.title',
				'Demande de mobilité internationale'
			)}
		>
			<Intro>
				<Trans i18nKey="pages.simulateurs.demande-mobilité.intro">
					Désormais, pour toutes vos demandes de mobilité internationale, les
					formulaires correspondants à votre situation sont disponibles sur la
					page du{' '}
					<Link
						href={t(
							'pages.simulateurs.demande-mobilité.href',
							'https://www.urssaf.fr/accueil/services/travail-etranger-mobilite.html'
						)}
						aria-label={t(
							'pages.simulateurs.demande-mobilité.aria-label',
							'service Mobilité internationale, nouvelle fenêtre'
						)}
					>
						service Mobilité internationale
					</Link>
					.
				</Trans>
			</Intro>
		</PageHeader>
	)
}
