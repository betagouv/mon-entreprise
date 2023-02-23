import { I18nProvider } from '@react-aria/i18n'
import { withProfiler } from '@sentry/react'
import { createRoot } from 'react-dom/client'

import App from '../App'
import i18next from '../locales/i18n'

import '../api/sentry'

export const AppFr = () => (
	<I18nProvider locale="fr-FR">
		<App basename="mon-entreprise" />
	</I18nProvider>
)

const AppFrWithProfiler = withProfiler(AppFr)

if (!import.meta.env.SSR) {
	i18next.changeLanguage('fr').catch((err) =>
		// eslint-disable-next-line no-console
		console.error(err)
	)
	const container = document.querySelector('#js') as Element
	const root = createRoot(container)
	root.render(<AppFrWithProfiler />)
}
