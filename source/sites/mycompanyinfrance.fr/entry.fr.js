import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

let anchor = document.querySelector('#js')
render(<App language="fr" basename="mon-entreprise" />, anchor)
