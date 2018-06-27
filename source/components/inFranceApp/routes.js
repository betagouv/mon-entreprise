import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import '../../containers/reset.css'
import withTracker from '../withTracker'
import Landing from './Landing'
import Hiring from './Steps/Cost and benefits'
import CreateMyCompany from './Steps/Create/index'
import FindMyCompany from './Steps/Find'
import './ui/index.css'
class Layout extends Component {
	componentDidMount() {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage['lang'] = 'en'
		}
		this.props.tracker.push(['trackPageView'])
	}
	render() {
		return (
			<>
				<Helmet>
					<link
						href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:100"
						rel="stylesheet"
					/>
				</Helmet>
				<Switch>
					<Route exact path="/" component={Landing} />
					<div className="ui__ container">
						<Route path="/create-my-company" component={CreateMyCompany} />
						<Route path="/hiring-and-social-security" component={Hiring} />
						<Route path="/find-my-company" component={FindMyCompany} />
					</div>
				</Switch>
			</>
		)
	}
}

export default withTracker(Layout)
