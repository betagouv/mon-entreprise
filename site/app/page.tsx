'use client'

import { useTranslation } from 'react-i18next'

import { Body, Button, H1 } from '@/design-system'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function Home() {
	const { t } = useTranslation()
	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<main>
			<H1>{t('app.titre', 'Mon entreprise — Next.js')}</H1>
			<Body>
				{t(
					'app.description',
					'Migration en cours. Cette page confirme que Next.js et le design-system sont correctement configurés.'
				)}
			</Body>
			<Button onPress={() => setDarkMode(!darkMode)}>
				{darkMode
					? t('app.basculerLight', 'Basculer en mode light')
					: t('app.basculerDark', 'Basculer en mode dark')}
			</Button>
		</main>
	)
}
