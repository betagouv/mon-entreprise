import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import '../../containers/reset.css'
import withTracker from '../withTracker'
import Landing from './Landing'
import Create from './Steps/Create'
import './ui/index.css'
class Layout extends Component {
	componentDidMount() {
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
					<div className="ui__container">
						<Route path="/steps/creating-my-company" component={Create} />
						<Route path="/steps/search-my-company" component={Create} />
					</div>
				</Switch>
			</>
		)
	}
}

export default withTracker(Layout)
