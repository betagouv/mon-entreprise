// import 'core-js/stable'
import rules from 'modele-social'
// import 'regenerator-runtime/runtime'
import App from '../source/App'
import i18next from '../source/locales/i18n'
import translations from '../source/locales/ui-en.yaml'
import '../source/sentry'

i18next.addResourceBundle('en', 'translation', translations)
i18next.changeLanguage('en')

export default function Index() {
	return <App basename="mon-entreprise" rules={rules} />
}
