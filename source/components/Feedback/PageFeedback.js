/* @flow */

import classnames from 'classnames'
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
	useful: ?boolean,
	visible: boolean
}

class PageFeedback extends Component<Props, State> {
	state = {
		useful: null,
		visible: true
	}

	handleClose = () => {
		this.setState({ visible: false })
	}
	handleFeedback = ({ useful }) => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			'page usefulness rated',
			this.props.location.pathname,
			useful ? 10 : 0
		])
		this.setState({ useful })
	}
	handleErrorReporting = () => {}
	render() {
		return (
			<div
				className={classnames(
					'feedback-page',
					'ui__ container notice',
					this.state.visible && 'visible'
				)}>
				{this.state.useful === null ? (
					<>
						<Trans i18nKey="feedback.question">
							Cette page vous a-t-elle été utile ?
						</Trans>{' '}
						<button
							style={{ marginLeft: '0.6rem' }}
							className="ui__ link-button"
							onClick={() => this.handleFeedback({ useful: true })}>
							<Trans>Oui</Trans>
						</button>{' '}
						<button
							style={{ marginLeft: '0.6rem' }}
							className="ui__ link-button"
							onClick={() => this.handleFeedback({ useful: false })}>
							<Trans>Non</Trans>
						</button>
					</>
				) : this.state.useful === true ? (
					<Trans i18nKey="feedback.thanks">Merci pour votre retour !</Trans>
				) : (
					/* this.state.useful === false ? */
					<Form onEnd={this.handleClose} />
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
