import { I18nProvider } from '@react-aria/i18n'
import { withProfiler } from '@sentry/react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import App from '../components/App'
import i18next from '../locales/i18n'

import '../api/sentry'

declare global {
	interface Window {
		PRERENDER?: boolean
	}
}

export const AppFr = () => {
	return (
		<I18nProvider locale="fr-FR">
			<App basename="mon-entreprise" />
		</I18nProvider>
	)
}

const AppFrWithProfiler = withProfiler(AppFr)

if (!import.meta.env.SSR) {
	i18next.changeLanguage('fr').catch((err) =>
		// eslint-disable-next-line no-console
		console.error(err)
	)
	const container = document.querySelector('#js') as Element
	if (window.PRERENDER) {
		const root = hydrateRoot(container, <AppFrWithProfiler />)
	} else {
		const root = createRoot(container)
		root.render(<AppFrWithProfiler />)
	}
}
