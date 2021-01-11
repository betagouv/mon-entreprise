// We disable Speedy mode for Styled-Component in production because it created a bug for overlay appearance
// https://stackoverflow.com/questions/53486470/react-styled-components-stripped-out-from-production-build
global.SC_DISABLE_SPEEDY = true

import 'core-js/stable'
import { hot } from 'react-hot-loader/root'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'modele-social'
import i18next from '../locales/i18n'
import translations from '../locales/ui-en.yaml'
import ruleTranslations from '../locales/rules-en.yaml'
import translateRules from '../locales/translateRules'
import App from './App'

i18next.addResourceBundle('en', 'translation', translations)
i18next.changeLanguage('en')

const Root = hot(() => (
	<App
		basename="infrance"
		rules={translateRules('en', ruleTranslations, rules)}
	/>
))

const anchor = document.querySelector('#js')
render(<Root />, anchor)
