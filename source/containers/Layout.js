import React, { Component } from 'react'
import './Layout.css'
import './reset.css'
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import HomeEmbauche from 'Components/HomeEmbauche'
import HomeSyso from 'Components/HomeSyso'
import Rule from 'Components/rule/Rule'
import Route404 from 'Components/Route404'
import Contact from 'Components/Contact'
import Simulateur from 'Components/Simulateur'
import Results from 'Components/Results'

import ReactPiwik from 'react-piwik';
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

const piwik = new ReactPiwik({
  url: 'stats.data.gouv.fr',
  siteId: 39,
  trackErrors: true,
});

export default class Layout extends Component {
	render() {
		let displayWarning = ['/simu/', '/regle/'].find(t => window.location.href.toString().indexOf(t) > -1)

		// track the initial pageview
		ReactPiwik.push(['trackPageView'])

		return (
			<Router history={piwik.connectToHistory(history)}>
				<div id="main">
					<div id="ninetyPercent">
						<div id="header">

							{ displayWarning &&
								<div id="warning">
									<Link to="/contact">version BETA</Link>
								</div>
							}
							{
								// this.props.location.pathname != '/' &&
								// <Link to="/">
								// 	<img id="site-logo" src={require('../images/logo.png')} />
								// </Link>
							}
						</div>
						<Switch>
							<Route exact path="/" component={HomeEmbauche}/>
							<Route exact path="/syso" component={HomeSyso}/>
							<Route path="/contact" component={Contact} />
							<Route path="/regle/:name" component={Rule} />
							<Route path="/simu/:name/:intro?" component={Simulateur} />
							<Route component={Route404} />
						</Switch>
					</div>
					<Results />
				</div>
			</Router>
		)
	}
}
