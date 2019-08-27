import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

let anchor = document.querySelector('#js')

render(<App />, anchor)
