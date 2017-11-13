import React, { Component } from 'react'
import './Layout.css'
import './reset.css'
import './ribbon.css'

import {Link, Route, Router, Switch, Redirect} from 'react-router-dom'

import Home from 'Components/Home'
import Rule from 'Components/rule/Rule'
import Route404 from 'Components/Route404'
import Contact from 'Components/Contact'
import Simulateur from 'Components/Simulateur'
import Results from 'Components/Results'
import RulesList from "Components/RulesList"

import ReactPiwik from 'Components/Tracker';
import createHistory from 'history/createBrowserHistory'

const piwik = new ReactPiwik({
	url: 'stats.data.gouv.fr',
	siteId: 39,
	trackErrors: true,
})

export default class Layout extends Component {
	history = createHistory()
	state = {
		resultsHeight: 0
	}
	render() {
		let displayWarning = ["/simu/", "/regle/", "/regles"].find(
			t => window.location.href.toString().indexOf(t) > -1
		)

		// track the initial pageview
		ReactPiwik.push(["trackPageView"])

		return (
			<Router history={piwik.connectToHistory(this.history)}>
				<div id="main">
					<div>
						<div id="header">

							{ displayWarning &&
								<span id="ribbon">
									<Link to="/contact"><em>version beta</em> <i className="fa fa-flask" aria-hidden="true"></i></Link>
								</span>
							}
							{
								// this.props.location.pathname != '/' &&
								// <Link to="/">
								// 	<img id="site-logo" src={require('../images/logo.png')} />
								// </Link>
							}
						</div>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/contact" component={Contact} />
							<Route path="/regle/:name" component={Rule} />
							<Route path="/regles" component={RulesList} />
							<Route path="/simu/:targets/:firstInput?" component={Simulateur} />
							<Redirect from="/simu/:name/intro" to="/simu/:name" />
							<Route component={Route404} />
						</Switch>
					</div>
					<div id="antiOverlap" style={{height: this.state.resultsHeight + 'px'}}/>
					<Results setElementHeight={resultsHeight => this.setState({resultsHeight})}/>
				</div>
			</Router>
		)
	}
}
