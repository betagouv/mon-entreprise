import SetCSSColour from 'Components/utils/SetCssColour'
import { TrackerProvider } from 'Components/utils/withTracker'
import createHistory from 'history/createBrowserHistory'
import i18next from 'i18next'
import React, { PureComponent } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers from 'Reducers/rootReducer'
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import computeThemeColours from 'Ui/themeColours'
import { getIframeOption, inIframe } from './utils'
import { enableBatching } from 'redux-batched-actions'

let initialStore = {
	themeColours: computeThemeColours(getIframeOption('couleur'))
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

if (
	process.env.NODE_ENV === 'production' &&
	'serviceWorker' in navigator &&
	!inIframe()
) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js')
			.then(registration => {
				console.log('SW registered: ', registration)
			})
			.catch(registrationError => {
				console.log('SW registration failed: ', registrationError)
			})
	})
}

export default class Layout extends PureComponent {
	constructor(props) {
		super(props)
		this.history = createHistory({
			basename: process.env.NODE_ENV === 'production' ? '' : this.props.basename
		})
		this.props.tracker?.connectToHistory(this.history)
		const storeEnhancer = composeEnhancers(
			applyMiddleware(
				// Allows us to painlessly do route transition in action creators
				thunk.withExtraArgument(this.history),
				...props.reduxMiddlewares
			)
		)
		this.store = createStore(
			enableBatching(reducers),
			{ ...initialStore, ...this.props.initialStore },
			storeEnhancer
		)
		this.props.onStoreCreated && this.props.onStoreCreated(this.store)
		if (this.props.language) {
			i18next.changeLanguage(this.props.language)
		}
	}
	render() {
		return (
			// If IE < 11 display nothing
			<Provider store={this.store}>
				<TrackerProvider value={this.props.tracker}>
					<SetCSSColour />
					<I18nextProvider i18n={i18next}>
						<Router history={this.history}>
							<>{this.props.children}</>
						</Router>
					</I18nextProvider>
				</TrackerProvider>
			</Provider>
		)
	}
}
