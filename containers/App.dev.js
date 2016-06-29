import React, {Component} from 'react'

import Explorer from './Explorer'
import { Provider } from 'react-redux'
import DevTools from '../DevTools'

import './App.css'

export default class App extends Component {
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<div>
					<Explorer />
					<DevTools />
				</div>
			</Provider>
		)
	}
}
