// TODO : load translation only if en
import 'Components/ui/index.css'
import 'iframe-resizer'
import { useEffect } from 'react'
import { hot } from 'react-hot-loader'
import { Redirect, Route, Switch } from 'react-router-dom'
import Provider from '../../Provider'
import redirects from '../mon-entreprise.fr/redirects'
import Communauté from './Communauté'
import { Header } from './Header'
import Landing from './Landing'
import Langage from './Langage'
import LazyStudio from './LazyStudio'

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
					<Route path="/studio" component={LazyStudio} />
					<Route path="/langage" component={Langage} />
					<Route exact path="/communauté" component={Communauté} />
				</Switch>
			</div>
		</>
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
