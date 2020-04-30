import { hot } from 'react-hot-loader/root'
import 'core-js/stable'
import 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'Rules'
import App from './App'
import i18next from '../../i18n'

i18next.changeLanguage('fr')

const Root = hot(() => <App basename="mon-entreprise" rules={rules} />)

const anchor = document.querySelector('#js')
render(<Root />, anchor)
