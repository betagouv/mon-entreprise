// TODO : load translation only if en
import 'Components/ui/index.css'
import 'iframe-resizer'
import { hot } from 'react-hot-loader'
import { Route, Switch, Redirect } from 'react-router-dom'
import Provider from '../../Provider'
import redirects from '../mon-entreprise.fr/redirects'
import Api from './Api'
import Landing from './Landing'
import LazyStudio from './LazyStudio'
import Communauté from './Communauté'
import Langage from './Langage'
import { Header } from './Header'
import { useEffect } from 'react'

function Router() {
	return (
		<Provider basename="publicodes">
			<RouterSwitch />
		</Provider>
	)
}

const RouterSwitch = () => {
	useEffect(() => {
		removeLoadingLogo()
	}, [])
	return (
		<>
			<Header />
			<div
				className="app-content ui__ container"
				css={`
					main {
						margin: 2rem 0;
					}
				`}
			>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route exact path="/accueil">
						<Redirect to="/" />
					</Route>
					<Route path="/studio" component={LazyStudio} />
					<Route path="/langage" component={Langage} />
					<Route exact path="/communauté" component={Communauté} />
					<Route component={App} />
				</Switch>
			</div>
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

const removeLoadingLogo = () => {
	const css = document.createElement('style')
	css.type = 'text/css'
	css.innerHTML = `
		#js {
			animation: appear 0.5s;
			opacity: 1;
		}
		#loading {
			display: none !important;
		}`
	document.body.appendChild(css)
}

export default hot(module)(Router)
