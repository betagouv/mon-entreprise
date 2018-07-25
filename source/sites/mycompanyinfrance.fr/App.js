import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import Landing from './Landing'
import CreateMyCompany from './pages/Company'
import StepsHeader from './pages/Header/StepsHeader'
import HiringProcess from './pages/HiringProcess'
import SocialSecurity from './pages/SocialSecurity'

@withTracker
class InFranceRoute extends Component {
	componentDidMount() {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage['lang'] = 'en'
		}
		this.props.tracker.push(['trackPageView'])
	}
	render() {
		return (
			<Provider basename="infrance">
				<Switch>
					<Route exact path="/" component={Landing} />
					<>
						{/* Passing location down to prevent update blocking */}
						<StepsHeader location={location} />
						<div className="ui__ container">
							<Route path="/register" component={CreateMyCompany} />
							<Route path="/social-security" component={SocialSecurity} />
							<Route path="/hiring-process" component={HiringProcess} />
						</div>
					</>
					<Route render={() => <Redirect to="/a" />} />
				</Switch>
			</Provider>
		)
	}
}

let ExportedApp = InFranceRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(InFranceRoute)
}

export default ExportedApp
