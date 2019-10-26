import 'core-js/stable'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import App from './App'

let anchor = document.querySelector('#js')
render(<App language="fr" basename="mon-entreprise" />, anchor)
