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

const darkModeAntiFlashScript = `
	try {
		if (window.localStorage.getItem('darkMode') === 'true') {
			const styleEl = document.createElement('style')
			document.head.appendChild(styleEl)
			styleEl.sheet.insertRule(
				'body * { background-color: #0f172a !important; color: white !important; border-color: white }',
				0
			)
			addEventListener('load', () => document.head.removeChild(styleEl))
		}
	} catch (e) {}
`

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang={langue} className={`${roboto.variable} ${montserrat.variable}`}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: darkModeAntiFlashScript }} />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
