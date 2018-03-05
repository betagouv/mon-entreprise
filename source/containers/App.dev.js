var I18n = require("i18n-js");
I18n.locale = "en"

import React from 'react'
import DevTools from '../DevTools'
import { Provider } from 'react-redux'
import Layout from './Layout'

export default ({ store }) => (
	<Provider store={store}>
		<div id="dev">
			<Layout />
			<DevTools />
		</div>
	</Provider>
)
