import { Trans } from 'react-i18next'

import image from '@/assets/images/road-sign.svg'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/design-system/buttons'
import { Container } from '@/design-system/layout'

import DefaultHelmet from './utils/DefaultHelmet'

export default function Route404() {
	return (
		<Container>
			<DefaultHelmet>
				<meta name="robots" content="noindex" />
			</DefaultHelmet>

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
