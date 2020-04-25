import 'core-js/stable'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'Rules'
import App from './App'
import i18next from '../../i18n'

i18next.changeLanguage('fr')

let anchor = document.querySelector('#js')
render(<App basename="mon-entreprise" rules={rules} />, anchor)
