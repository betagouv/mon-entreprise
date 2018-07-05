import Contact from 'Components/Contact'
import Mecanisms from 'Components/Mecanisms'
import About from 'Components/pages/About'
import Contribution from 'Components/pages/Contribution'
import { Header } from 'Components/pages/Header'
import Home from 'Components/pages/Home'
import Integration from 'Components/pages/Integration'
import RulesList from 'Components/pages/RulesList'
import Route404 from 'Components/Route404'
import RulePage from 'Components/RulePage'
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import withTracker from '../components/withTracker'
import './Layout.css'
import './reset.css'

class Layout extends Component {
	componentDidMount() {
		this.props.tracker.push(['trackPageView'])
	}
	render() {
		return (
			<>
				<Header />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/contact" component={Contact} />
					<Route path="/règle/:name" component={RulePage} />
					<Redirect from="/simu/*" to="/" />
					<Route path="/règles" component={RulesList} />
					<Route path="/mecanismes" component={Mecanisms} />
					<Route path="/à-propos" component={About} />
					<Route path="/intégrer" component={Integration} />
					<Route path="/contribuer" component={Contribution} />
					<Redirect from="/simulateur" to="/" />
					<Redirect from="/couleur.html" to="/" />
					<Route component={Route404} />
				</Switch>
			</>
		)
	}
}

export default withTracker(Layout)
