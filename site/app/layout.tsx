import { cookies } from 'next/headers'
import { ReactNode } from 'react'

import {
	DARK_MODE_STORAGE_KEY,
	parseDarkModeValue,
} from '@/components/utils/darkModeStorage'
import StyledComponentsRegistry from '@/design-system/StyledComponentsRegistry'
import { NextJsNavigationProvider } from '@/lib/navigation/providers/NextJsNavigationProvider'
import i18next, { langue } from '@/locales/i18n-server'

import { Providers } from './Providers'

export const metadata = {
	title: i18next.t('metadata.titre', 'Mon entreprise'),
	description: i18next.t(
		'metadata.description',
		"L'assistant officiel de l'entrepreneur : simulateurs de cotisations, choix du statut, et plus encore."
	),
}

export default async function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	const cookieStore = await cookies()
	const initialDarkMode = parseDarkModeValue(
		cookieStore.get(DARK_MODE_STORAGE_KEY)?.value
	)

	return (
		<html lang={langue}>
			<body>
				<StyledComponentsRegistry>
					<NextJsNavigationProvider>
						<Providers initialDarkMode={initialDarkMode}>{children}</Providers>
					</NextJsNavigationProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	)
}
