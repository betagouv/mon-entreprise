import { I18nProvider } from '@react-aria/i18n'
import rules from 'modele-social'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import App from './App'
import i18next from './locales/i18n'
import './sentry'

i18next.changeLanguage('fr')

const AppFr = () => (
	<I18nProvider locale="fr-FR">
		<App basename="mon-entreprise" rules={rules} />
	</I18nProvider>
)

render(<AppFr />, document.querySelector('#js'))
