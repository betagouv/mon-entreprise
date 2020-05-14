import 'core-js/stable'
import { hot } from 'react-hot-loader/root'
import { translateRules } from 'publicodes'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'Rules'
import i18next from '../../i18n'
import translations from '../../locales/ui-en.yaml'
import ruleTranslations from '../../locales/rules-en.yaml'
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
