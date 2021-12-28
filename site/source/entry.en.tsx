import { I18nProvider } from '@react-aria/i18n'
import rules from 'modele-social'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import App from './App'
import i18next from './locales/i18n'
import ruleTranslations from './locales/rules-en.yaml'
import translateRules from './locales/translateRules'
import translations from './locales/ui-en.yaml'
import './sentry'

i18next.addResourceBundle('en', 'translation', translations)
i18next.changeLanguage('en')

const AppEn = () => (
	<I18nProvider locale="en-GB">
		<App
			basename="infrance"
			rules={translateRules('en', ruleTranslations, rules)}
		/>
	</I18nProvider>
)

render(<AppEn />, document.querySelector('#js'))
