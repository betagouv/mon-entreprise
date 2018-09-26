/* @flow */

import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import './Feedback.css'
import Form from './FeedbackForm'
import type { Tracker } from 'Components/utils/withTracker'
import type { Location } from 'react-router-dom'

type Props = {
	location: Location,
	tracker: Tracker
}
type State = {
	showForm: boolean,
	showThanks: boolean
}

class PageFeedback extends Component<Props, State> {
	state = {
		showForm: false,
		showThanks: false
	}

	handleFeedback = ({ useful }) => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			'rate page usefulness',
			this.props.location.pathname,
			useful ? 10 : 0
		])
		this.setState({ showThanks: useful, showForm: !useful })
	}
	handleErrorReporting = () => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			'report error',
			this.props.location.pathname
		])
		this.setState({ showForm: true })
	}
	render() {
		return (
			<div className="feedback-page ui__ container notice">
				{!this.state.showForm &&
					!this.state.showThanks && (
						<>
							<div style={{ flex: 1 }}>
								<Trans i18nKey="feedback.question">
									Cette page vous a-t-elle été utile ?
								</Trans>{' '}
								<button
									style={{ marginLeft: '0.4rem' }}
									className="ui__ link-button"
									onClick={() => this.handleFeedback({ useful: true })}>
									<Trans>Oui</Trans>
								</button>{' '}
								<button
									style={{ marginLeft: '0.4rem' }}
									className="ui__ link-button"
									onClick={() => this.handleFeedback({ useful: false })}>
									<Trans>Non</Trans>
								</button>
							</div>
							<button
								className="ui__ link-button"
								onClick={this.handleErrorReporting}>
								<Trans i18nKey="feedback.reportError">Report an error</Trans>
							</button>{' '}
						</>
					)}
				{this.state.showThanks && (
					<Trans i18nKey="feedback.thanks">Merci pour votre retour !</Trans>
				)}
				{this.state.showForm && (
					<Form
						onEnd={() => this.setState({ showThanks: true, showForm: false })}
					/>
				)}
			</div>
		)
	}
}

export default compose(
	translate(),
	withRouter,
	withTracker
)(PageFeedback)
