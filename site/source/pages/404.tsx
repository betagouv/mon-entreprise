import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'

import image from '@/assets/images/road-sign.svg'
import PageHeader from '@/components/PageHeader'
import Meta from '@/components/utils/Meta'
import { Button } from '@/design-system/buttons'
import { Container } from '@/design-system/layout'

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
					<Trans i18nKey="404.message">
						Cette page n'existe pas ou n'existe plus
					</Trans>
				}
				picture={image}
			>
				<Button size="XL" role="link" to={'/'}>
					<Trans i18nKey="404.action">Revenir en lieu sûr</Trans>
				</Button>
			</PageHeader>
		</Container>
	)
}
