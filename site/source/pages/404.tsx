import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'

import illustration from '@/assets/images/illustrations/road-sign.svg'
import PageHeader from '@/components/PageHeader'
import Meta from '@/components/utils/Meta'
import { Button, Container, Spacing } from '@/design-system'

export default function Page404() {
	const { t } = useTranslation()

	return (
		<Container>
			<Meta
				title={t('pages.404.title', 'Page introuvable')}
				description={t(
					'pages.404.description',
					"La page que vous cherchez n'existe pas ou n'existe plus"
				)}
			/>
			<Helmet>
				<meta name="robots" content="noindex" />
			</Helmet>

			<PageHeader
				titre={
					<Trans i18nKey="pages.404.message">
						Cette page n'existe pas ou n'existe plus
					</Trans>
				}
				picture={illustration}
			>
				<Button size="XL" to={'/'}>
					<Trans i18nKey="pages.404.action">Revenir en lieu sûr</Trans>
				</Button>
			</PageHeader>
			<Spacing xxl />
		</Container>
	)
}
