import { withProfiler } from '@sentry/react'
import { I18nProvider } from 'react-aria'
import { createRoot } from 'react-dom/client'
import { initReactI18next } from 'react-i18next'

import App from '../components/App'

import '../design-system/fonts.css'

import { setAppLanguage } from '../locales/i18n'

import '../api/sentry'

export const AppFr = () => (
	<I18nProvider locale="fr-FR">
		<App basename="mon-entreprise" />
	</I18nProvider>
)

const AppFrWithProfiler = withProfiler(AppFr)

if (!import.meta.env.SSR) {
	setAppLanguage('fr', { plugins: [initReactI18next] })
	const container = document.querySelector('#js') as Element
	const root = createRoot(container)
	root.render(<AppFrWithProfiler />)
}
