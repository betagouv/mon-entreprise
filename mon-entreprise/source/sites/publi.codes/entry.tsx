import 'core-js/stable'
import React from 'react'
import { render } from 'react-dom'
import 'regenerator-runtime/runtime'
import App from './App'

const anchor = document.querySelector('#js')
render(<App />, anchor)
