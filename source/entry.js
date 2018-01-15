import React from 'react'
import { render } from 'react-dom'
import { compose, createStore } from 'redux'
import App from './containers/App'
import reducers from './reducers'
import DevTools from './DevTools'
import { AppContainer } from 'react-hot-loader'
import computeThemeColours from './components/themeColours'

let url = window.location.href.toString(),
	urlColour = url.includes('couleur=')
let initialStore = {
	iframe: url.includes('iframe'),
	themeColours: computeThemeColours(
		urlColour && url.split('couleur=')[1].split('&')[0]
	)
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
