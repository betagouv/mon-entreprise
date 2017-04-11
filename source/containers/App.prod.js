import React, {Component} from 'react'

import { Provider } from 'react-redux'
import routes from '../routes'
import {Router} from 'react-router'

export default class App extends Component {
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<Router routes={routes} history={history} />
			</Provider>
		)
	}
}
