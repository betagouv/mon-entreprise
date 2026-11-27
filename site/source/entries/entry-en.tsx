import { withProfiler } from '@sentry/react'
import { I18nProvider } from 'react-aria'
import { createRoot } from 'react-dom/client'
import { initReactI18next } from 'react-i18next'

import App from '../components/App'

import '../design-system/fonts.css'

import { englishCatalog } from '../locales/englishCatalog'
import { setAppLanguage } from '../locales/i18n'

import '../api/sentry'

export const AppEn = () => (
	<I18nProvider locale="en-GB">
		<App basename="infrance" />
	</I18nProvider>
)

const AppEnWithProfiler = withProfiler(AppEn)

if (!import.meta.env.SSR) {
	setAppLanguage('en', {
		catalog: englishCatalog,
		plugins: [initReactI18next],
	})

	const container = document.querySelector('#js') as Element
	const root = createRoot(container)
	root.render(<AppEnWithProfiler />)
}
