// TODO : load translation only if en
import 'Components/ui/index.css'
import 'iframe-resizer'
import React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch } from 'react-router-dom'
import Provider from '../../Provider'
import redirects from '../mon-entreprise.fr/redirects'
import Api from './Api'
import Landing from './Landing'
import Studio from './LazyStudio'
import Mécanismes from './Mécanismes'

function Router() {
	return (
		<Provider basename="publicodes">
			<RouterSwitch />
		</Provider>
	)
}

const RouterSwitch = () => {
	return (
		<>
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route path="/studio" component={Studio} />
				<Route exact path="/mécanismes" component={Mécanismes} />
				<Route exact path="/api" component={Api} />
				<Route component={App} />
			</Switch>
		</>
	)
}

const App = () => {
	return (
		<div className="app-content">
			<div className="ui__ container" style={{ flexGrow: 1, flexShrink: 0 }}>
				<Switch>{redirects}</Switch>
			</div>
		</div>
	)
}

export default hot(module)(Router)
