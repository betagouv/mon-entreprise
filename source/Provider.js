import SetCSSColour from 'Components/utils/SetCssColour';
import { ThemeColoursProvider } from 'Components/utils/withColours';
import { SitePathProvider } from 'Components/utils/withSitePaths';
import { TrackerProvider } from 'Components/utils/withTracker';
import createHistory from 'history/createBrowserHistory';
import i18next from 'i18next';
import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import reducers from 'Reducers/rootReducer';
import { applyMiddleware, compose, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import thunk from 'redux-thunk';
import { getIframeOption, inIframe } from './utils';

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
		if (this.props.language) {
			i18next.changeLanguage(this.props.language)
			if (this.props.initialStore)
				this.props.initialStore.lang = this.props.language
		}
		this.store = createStore(
			enableBatching(reducers),
			this.props.initialStore,
			storeEnhancer
		)
		this.props.onStoreCreated && this.props.onStoreCreated(this.store)
	}
	render() {
		return (
			// If IE < 11 display nothing
			<Provider store={this.store}>
			<ThemeColoursProvider colour={getIframeOption('couleur')}>
				<TrackerProvider value={this.props.tracker}>
					<SitePathProvider value={this.props.sitePaths}>
						<SetCSSColour />
						<I18nextProvider i18n={i18next}>
							<Router history={this.history}>
								<>{this.props.children}</>
							</Router>
						</I18nextProvider>
					</SitePathProvider>
				</TrackerProvider>
				</ThemeColoursProvider>
			</Provider>
		)
	}
}
