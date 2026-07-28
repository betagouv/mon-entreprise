'use client'

import { Trans, useTranslation } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { Body, Button, Container, Intro, Strong } from '@/design-system'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function Home() {
	const { t } = useTranslation()
	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<Container>
			<Button
				tracking={{ feature: 'démo next', action: 'bascule mode sombre' }}
				onPress={() => setDarkMode(!darkMode)}
			>
				{darkMode
					? t('app.basculerLight', 'Basculer en mode light')
					: t('app.basculerDark', 'Basculer en mode dark')}
			</Button>

			<PageHeader
				titre={t('landing.title', "L'assistant officiel des entrepreneurs")}
				picture="/images/home-banner-illustration.svg"
			>
				<Intro $xxl>
					<Trans i18nKey="landing.subtitle">
						Des <Strong>assistants et simulateurs</Strong> pour obtenir des{' '}
						<Strong>réponses personnalisées</Strong> à vos questions sur la{' '}
						création et la gestion de votre entreprise.
					</Trans>
				</Intro>

				<Body>
					{t(
						'pages.simulateurs.accueil.header',
						'Tous les simulateurs sur ce site sont maintenus à jour avec les dernières évolutions législatives.'
					)}
				</Body>
			</PageHeader>
		</Container>
	)
}
