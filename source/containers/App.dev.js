import React, {Component} from 'react'

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
					<DevTools />
				</div>
			</Provider>
		)
	}
}
