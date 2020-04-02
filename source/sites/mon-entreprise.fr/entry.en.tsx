import 'core-js/stable'
import { translateRules } from 'Engine'
import rules from 'Publicode/rules'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import translations from '../../locales/rules-en.yaml'
import App from './App'

let anchor = document.querySelector('#js')
console.log(translateRules('en', translations, rules))
render(
	<App
		language="en"
		basename="infrance"
		rules={translateRules('en', translations, rules)}
	/>,
	anchor
)
