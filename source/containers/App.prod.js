// App.dev without the redux DevTools
import React, { Component } from 'react'

import { Provider } from 'react-redux'
import DevTools from '../DevTools'
import Layout from './Layout'

export default class App extends Component {
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<div>
					<Layout />
				</div>
			</Provider>
		)
	}
}
