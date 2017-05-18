import React from 'react'
import { render } from 'react-dom'
import { compose, createStore } from 'redux'
import App from './containers/App'
import reducers from './reducers'
import DevTools from './DevTools'
import { AppContainer } from 'react-hot-loader'

let store = createStore(
  reducers,
  compose(
    DevTools.instrument()
  )
)

let anchor = document.querySelector('#js')

render(
		<App store={store}/>,
	anchor
)

// Hot react component reloading. Unstable but helpful.
if (module.hot) {
	module.hot.accept('./containers/App', () => {
	// If you use Webpack 2 in ES modules mode, you can
	// use <App /> here rather than require() a <NextApp />.
		const NextApp = require('./containers/App').default
		render(
			<AppContainer>
				<NextApp store={store} />
			</AppContainer>,
			anchor
		)
	})
}

export {anchor}
