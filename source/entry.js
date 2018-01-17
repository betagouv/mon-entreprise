import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import App from './containers/App'
import reducers from './reducers'
import DevTools from './DevTools'
import { AppContainer } from 'react-hot-loader'
import debounceFormChangeActions from './debounceFormChangeActions'

let createStoreWithMiddleware = applyMiddleware(debounceFormChangeActions())(
	createStore
)

let store = createStoreWithMiddleware(reducers, compose(DevTools.instrument()))

let anchor = document.querySelector('#js')

render(<App store={store} />, anchor)

// Hot react component reloading. Unstable but helpful.
if (module.hot) {
	module.hot.accept('./containers/App', () => {
		render(
			<AppContainer>
				<App store={store} />
			</AppContainer>,
			anchor
		)
	})
}

export { anchor }
