import React from 'react'
import { render } from 'react-dom'
import { compose, createStore } from 'redux'
import App from './containers/App'
import reducers from './reducers'
import DevTools from './DevTools'
import { AppContainer } from 'react-hot-loader'
import computeThemeColours from './components/themeColours'
import { getIframeOption, getUrl } from './utils'

let initialStore = {
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur'))
}

let store = createStore(reducers, initialStore, compose(DevTools.instrument()))
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
