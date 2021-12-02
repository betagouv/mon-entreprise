import 'core-js/stable'
import rules from 'modele-social'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import 'regenerator-runtime/runtime'
import App from './App'
import i18next from './locales/i18n'
import ruleTranslations from './locales/rules-en.yaml'
import translateRules from './locales/translateRules'
import translations from './locales/ui-en.yaml'
import './sentry'
import { I18nProvider } from '@react-aria/i18n'

i18next.addResourceBundle('en', 'translation', translations)
i18next.changeLanguage('en')

const Root = hot(() => (
	<App
		basename="infrance"
		rules={translateRules('en', ruleTranslations, rules)}
	/>
))

const anchor = document.querySelector('#js')
render(
	<I18nProvider locale="en-GB">
		<Root />
	</I18nProvider>,
	anchor
)
