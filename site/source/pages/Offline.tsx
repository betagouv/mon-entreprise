import { FallbackRender } from '@sentry/react'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorLayout } from '@/components/ErrorPage'
import Meta from '@/components/utils/Meta'
import { Body, Grid, Intro, Message } from '@/design-system'

export const CatchOffline = ({ error }: ComponentProps<FallbackRender>) => {
	if (error.message.includes('dynamically imported module')) {
		return <Offline />
	} else {
		throw error
	}
}

function Offline() {
	const { t } = useTranslation()

	return (
		<ErrorLayout>
			<Grid
				container
				style={{ justifyContent: 'center', margin: '10rem 0' }}
				role="main"
			>
				<Grid item md={8} sm={12}>
					<Meta
						title={t('pages.offline.title', 'Hors ligne')}
						description={t(
							'pages.offline.description',
							'Vous êtes actuellement hors ligne.'
						)}
					/>
					<Message type="info" style={{ margin: '1rem 0' }}>
						<Intro>Vous êtes actuellement hors ligne.</Intro>
						<Body>
							Cette page n'a pas encore été téléchargée et n'est donc pas
							disponible sans internet, pour y accéder vérifiez votre connexion
							puis rechargez la page.
						</Body>
					</Message>
				</Grid>
			</Grid>
		</ErrorLayout>
	)
}
