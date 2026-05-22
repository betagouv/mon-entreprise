import { ReactNode } from 'react'

import i18next, { langue } from '@/locales/i18n-server'

import { montserrat, roboto } from './fonts'
import { Providers } from './Providers'

export const metadata = {
	title: i18next.t('metadata.titre', 'Mon entreprise'),
	description: i18next.t(
		'metadata.description',
		"L'assistant officiel de l'entrepreneur : simulateurs de cotisations, choix du statut, et plus encore."
	),
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang={langue} className={`${roboto.variable} ${montserrat.variable}`}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
