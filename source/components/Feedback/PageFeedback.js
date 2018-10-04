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
import type { Node } from 'react'

type Props = {
	location: Location,
	blacklist: Array<string>,
	customMessage?: Node,
	tracker: Tracker,
	customEventName?: string
}
type State = {
	showForm: boolean,
	showThanks: boolean
}

const localStorageKey = (feedback: [string, string]) =>
	`app::feedback::${feedback.join('::')}`
const saveFeedbackOccurrenceInLocalStorage = ([name, path, rating]: [
	string,
	string,
	number
]) => {
	localStorage.setItem(localStorageKey([name, path]), JSON.stringify(rating))
}
const feedbackAlreadyGiven = (feedback: [string, string]) => {
	return !!localStorage.getItem(localStorageKey(feedback))
}

class PageFeedback extends Component<Props, State> {
	static defaultProps = {
		blacklist: []
	}
	feedbackAlreadyGiven: boolean
	feedbackAlreadyGiven = false
	constructor(props) {
		super(props)
		this.state = {
			showForm: false,
			showThanks: false
		}
		this.feedbackAlreadyGiven = feedbackAlreadyGiven([
			this.props.customEventName || 'rate page usefulness',
			this.props.location.pathname
		])
	}

	handleFeedback = ({ useful }) => {
		const feedback = [
			this.props.customEventName || 'rate page usefulness',
			this.props.location.pathname,
			useful ? 10 : 0
		]
		this.props.tracker.push(['trackEvent', 'Feedback', ...feedback])
		saveFeedbackOccurrenceInLocalStorage(feedback)
		this.setState({
			showThanks: useful,
			showForm: !useful
		})
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
		if (this.feedbackAlreadyGiven) {
			return null
		}
		return (
			!this.props.blacklist.includes(this.props.location.pathname) && (
				<div className="feedback-page ui__ container notice">
					{!this.state.showForm &&
						!this.state.showThanks && (
							<>
								<div style={{ flex: 1 }}>
									{this.props.customMessage || (
										<Trans i18nKey="feedback.question">
											Cette page vous a-t-elle été utile ?
										</Trans>
									)}{' '}
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
									<Trans i18nKey="feedback.reportError">
										Signaler une erreur
									</Trans>
								</button>{' '}
							</>
						)}
					{this.state.showThanks && (
						<div>
							<Trans i18nKey="feedback.thanks">
								Merci pour votre retour ! Vous pouvez nous contacter directement
								à{' '}
								<a href="mailto:contact@embauche.beta.gouv.fr">
									contact@embauche.beta.gouv.fr
								</a>
							</Trans>
						</div>
					)}
					{this.state.showForm && (
						<Form
							onEnd={() => this.setState({ showThanks: true, showForm: false })}
						/>
					)}
				</div>
			)
		)
	}
}
const PageFeedbackWithRouter = ({ location, ...props }) => (
	<PageFeedback {...props} location={location} key={location.pathname} />
)

export default compose(
	translate(),
	withTracker,
	withRouter
)(PageFeedbackWithRouter)
