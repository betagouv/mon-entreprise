import React, { Component } from 'react'
import './Layout.css'
import './reset.css'
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import Home from './Home'
import Rule from '../components/Rule'
import Route404 from '../components/Route404'
import Contact from '../components/Contact'
import Simulateur from '../components/Simulateur'
import Results from '../components/Results'

export default class Layout extends Component {
	render() {
		return (
			<Router>
				<div id="main">
					<div id="ninetyPercent">
						<div id="header">
							<div id="warning">
								Attention ! Ce site est expérimental.
							</div>
							{
								// this.props.location.pathname != '/' &&
								// <Link to="/">
								// 	<img id="site-logo" src={require('../images/logo.png')} />
								// </Link>
							}
						</div>
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route path="/contact" component={Contact} />
							<Route path="/regle/:name" component={Rule} />
							<Route path="/simulateurs/:simulateurId" component={Simulateur} />
							<Route component={Route404} />
						</Switch>
					</div>
					<Results />
				</div>
			</Router>
		)
	}
}
