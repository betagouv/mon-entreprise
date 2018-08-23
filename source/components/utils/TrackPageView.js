import withTracker from 'Components/utils/withTracker'
import { Component } from 'react'

@withTracker
export default class TrackPageView extends Component {
	componentDidMount() {
		this.props.tracker.push(['trackPageView'])
	}
	render() {
		return null
	}
}
