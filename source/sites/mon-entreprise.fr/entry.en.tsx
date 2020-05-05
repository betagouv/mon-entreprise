import 'core-js/stable'
import 'react-hot-loader'
import { translateRules } from 'Engine'
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

let Root = () => (
	<App
		basename="infrance"
		rules={translateRules('en', ruleTranslations, rules)}
	/>
)

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader/root')
	Root = hot(Root)
}

const anchor = document.querySelector('#js')
render(<Root />, anchor)
