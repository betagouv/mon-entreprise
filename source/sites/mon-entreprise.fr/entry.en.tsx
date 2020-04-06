import 'core-js/stable'
import { translateRules } from 'Engine'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'Rules'
import translations from '../../locales/rules-en.yaml'
import App from './App'

let anchor = document.querySelector('#js')
render(
	<App
		language="en"
		basename="infrance"
		rules={translateRules('en', translations, rules)}
	/>,
	anchor
)
