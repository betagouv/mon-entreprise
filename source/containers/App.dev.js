import React, {Component} from 'react'

import { Provider } from 'react-redux'
import DevTools from '../DevTools'
import routes from '../routes'
import {Router, browserHistory} from 'react-router'


export default class App extends Component {
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<div>
					<Router routes={routes} history={browserHistory} />
					<DevTools />
				</div>
			</Provider>
		)
	}
}
