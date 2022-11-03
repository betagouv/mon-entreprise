import { I18nProvider } from '@react-aria/i18n'
import { withProfiler } from '@sentry/react'
import { render } from 'react-dom'

import App from './App'
import i18next from './locales/i18n'

import './sentry'

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
	render(<AppFrWithProfiler />, document.querySelector('#js'))
}
