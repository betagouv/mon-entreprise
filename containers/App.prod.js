import React, {Component} from 'react'

import Explorer from './Explorer'
import { Provider } from 'react-redux'

import './App.css'

export default class App extends Component {
	render() {
		const { store } = this.props
		return (
			<Provider store={store}>
				<Explorer />
			</Provider>
		)
	}
}
