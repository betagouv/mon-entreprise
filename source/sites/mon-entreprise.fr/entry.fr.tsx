import 'core-js/stable'
import React from 'react'
import { createRoot } from 'react-dom'
import 'regenerator-runtime/runtime'
import App from './App'

createRoot(document.querySelector('#js')).render(
	<App language="fr" basename="mon-entreprise" />
)
