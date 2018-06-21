import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import withTracker from '../components/withTracker'
import '../containers/reset.css'
import Landing from './Landing'
class Layout extends Component {
	componentDidMount() {
		this.props.tracker.push(['trackPageView'])
	}
	render() {
		return (
			<Switch>
				<Route exact path="/" component={Landing} />
			</Switch>
		)
	}
}

export default withTracker(Layout)
