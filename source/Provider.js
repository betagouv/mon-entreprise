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
import { safeLoad } from 'js-yaml'

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
			reducers,
			{ ...initialStore, ...this.props.initialStore },
			storeEnhancer
		)
		this.props.onStoreCreated && this.props.onStoreCreated(this.store)
		if (this.props.language) {
			i18next.changeLanguage(this.props.language)
		}
		this.state = { loadingRules: true }
	}
	componentDidMount() {
		fetch('https://raw.githubusercontent.com/laem/publi.codes/master/co2.yaml')
			.then(response => response.text())
			.then(text => {
				window.rawRules = safeLoad(text)
				this.setState({ loadingRules: false })
			})
	}
	render() {
		return (
			// If IE < 11 display nothing
			this.state.loadingRules ? (
				<div>Attends 2 secondes...</div>
			) : (
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
		)
	}
}
