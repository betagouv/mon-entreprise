'use client'

import { useTranslation } from 'react-i18next'

import { Button, Container } from '@/design-system'
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
		</Container>
	)
}
