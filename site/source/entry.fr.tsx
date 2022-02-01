import { I18nProvider } from '@react-aria/i18n'
import { render } from 'react-dom'
import App from './App'
import i18next from './locales/i18n'
import './sentry'

export const AppFr = () => (
	<I18nProvider locale="fr-FR">
		<App basename="mon-entreprise" />
	</I18nProvider>
)

if (!import.meta.env.SSR) {
	i18next.changeLanguage('fr')
	render(<AppFr />, document.querySelector('#js'))
}
