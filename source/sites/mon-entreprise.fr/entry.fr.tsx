import 'core-js/stable'
import 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import rules from 'Rules'
import App from './App'
import i18next from '../../i18n'

i18next.changeLanguage('fr')

let Root = () => <App basename="mon-entreprise" rules={rules} />

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader/root')
	Root = hot(Root)
}

const anchor = document.querySelector('#js')
render(<Root />, anchor)
