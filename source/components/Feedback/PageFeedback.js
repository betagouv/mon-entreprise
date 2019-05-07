/* @flow */

import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans, withTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import safeLocalStorage from '../../storage/safeLocalStorage'
import './Feedback.css'
import Form from './FeedbackForm'
import type { Tracker } from 'Components/utils/withTracker'
import type { Location } from 'react-router-dom'
import type { Node } from 'react'

type OwnProps = {
	blacklist: Array<string>,
	customMessage?: Node,
	customEventName?: string
}
type Props = OwnProps & {
	location: Location,
	tracker: Tracker
}
type State = {
	showForm: boolean,
	feedbackAlreadyGiven: boolean,
	showThanks: boolean
}

const localStorageKey = (feedback: [string, string]) =>
	`app::feedback::${feedback.join('::')}`
const saveFeedbackOccurrenceInLocalStorage = ([name, path, rating]: [
	string,
	string,
	number
]) => {
	safeLocalStorage.setItem(
		localStorageKey([name, path]),
		JSON.stringify(rating)
	)
}
const feedbackAlreadyGiven = (feedback: [string, string]) => {
	return !!safeLocalStorage.getItem(localStorageKey(feedback))
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
			showThanks: false,
			feedbackAlreadyGiven: feedbackAlreadyGiven([
				this.props.customEventName || 'rate page usefulness',
				this.props.location.pathname
			])
		}
	}

	handleFeedback = ({ useful }) => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			useful ? 'positive rating' : 'negative rating',
			this.props.location.pathname
		])
		const feedback = [
			this.props.customEventName || 'rate page usefulness',
			this.props.location.pathname,
			useful ? 10 : 0.1
		]
		this.props.tracker.push(['trackEvent', 'Feedback', ...feedback])
		saveFeedbackOccurrenceInLocalStorage(feedback)
		this.setState({
			showThanks: useful,
			feedbackAlreadyGiven: true,
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
		if (
			this.state.feedbackAlreadyGiven &&
			!this.state.showForm &&
			!this.state.showThanks
		) {
			return null
		}
		const pathname =
			this.props.location.pathname === '/' ? '' : this.props.location.pathname
		return (
			!this.props.blacklist.includes(pathname) && (
				<div
					className="ui__ container"
					style={{ display: 'flex', justifyContent: 'center' }}>
					<div className="feedback-page ui__ notice ">
						{!this.state.showForm && !this.state.showThanks && (
							<>
								<div style={{ flexShrink: 0 }}>
									{this.props.customMessage || (
										<Trans i18nKey="feedback.question">
											Cette page vous est utile ?
										</Trans>
									)}{' '}
								</div>
								<div className="feedbackButtons">
									<button
										className="ui__ link-button"
										onClick={() => this.handleFeedback({ useful: true })}>
										<Trans>Oui</Trans>
									</button>{' '}
									<button
										className="ui__ link-button"
										onClick={() => this.handleFeedback({ useful: false })}>
										<Trans>Non</Trans>
									</button>
									<button
										className="ui__ link-button"
										onClick={this.handleErrorReporting}>
										<Trans i18nKey="feedback.reportError">
											Faire une suggestion
										</Trans>
									</button>
								</div>
							</>
						)}
						{this.state.showThanks && (
							<div>
								<Trans i18nKey="feedback.thanks">
									Merci pour votre retour ! Vous pouvez nous contacter
									directement à{' '}
									<a href="mailto:contact@mon-entreprise.beta.gouv.fr">
										contact@mon-entreprise.beta.gouv.fr
									</a>
								</Trans>
							</div>
						)}
						{this.state.showForm && (
							<Form
								onEnd={() =>
									this.setState({ showThanks: true, showForm: false })
								}
								onCancel={() =>
									this.setState({ showThanks: false, showForm: false })
								}
							/>
						)}
					</div>
				</div>
			)
		)
	}
}
const PageFeedbackWithRouter = ({ location, ...props }) => (
	<PageFeedback {...props} location={location} key={location.pathname} />
)
export default (compose(
	withRouter,
	withTranslation(),
	withTracker
)(PageFeedbackWithRouter): React$ComponentType<OwnProps>)
