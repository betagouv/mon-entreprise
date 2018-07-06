import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import '../../containers/reset.css'
import RulePage from '../RulePage'
import withTracker from '../withTracker'
import Landing from './Landing'
import CreateMyCompany from './Steps/Company/index'
import CostsBenefits from './Steps/Costs and benefits'
import StepsHeader from './Steps/Header/StepsHeader'
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
					<>
						{/* Passing location down to prevent update blocking */}
						<StepsHeader location={location} />
						<div className="ui__ container">
							<Route path="/règle/:name" component={RulePage} />
							<Route path="/my-company" component={CreateMyCompany} />
							<Route path="/social-security" component={CostsBenefits} />
						</div>
					</>
				</Switch>
			</>
		)
	}
}

export default withTracker(Layout)
