/* @flow */

import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import type { Tracker } from 'Components/utils/withTracker'
import type { Location } from 'react-router-dom'

type Props = { onEnd: () => void, location: Location, tracker: Tracker }
type State = {
	formStep: 1 | 2 | null
}
type Explanation =
	| 'NOT UNDERSTANDABLE'
	| 'NOT RELEVANT'
	| 'POOR CONTENT'
	| 'OTHER'

class FeedbackForm extends Component<Props, State> {
	state = {
		formStep: 1
	}
	formRef: ?HTMLFormElement

	handleFormSubmit = e => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			'written feedback submitted'
		])
		e.preventDefault()
		// $FlowFixMe
		fetch('/', {
			method: 'POST',
			// $FlowFixMe
			body: new FormData(this.formRef)
		})
		this.handleClose()
	}
	handleClose = () => {
		this.setState({ formStep: null })
		this.props.onEnd()
	}
	handleExplanationGiven = (event: { target: { value: Explanation } }) => {
		this.props.tracker.push([
			'trackEvent',
			'Feedback',
			`bad rating explained: ${event.target.value}`,
			this.props.location.pathname
		])
		this.setState({ formStep: 2 })
	}
	render() {
		return (
			<>
				{this.state.formStep === 1 && (
					<fieldset>
						<legend>
							<p>
								<strong>
									<Trans i18nKey="feedback.bad.headline">
										Nous sommes désolé de ne pas vous avoir apporté entière
										satisfaction.
									</Trans>
								</strong>{' '}
								<Trans i18nKey="feedback.bad.question">
									Quel a été le principal problème ?
								</Trans>
							</p>
						</legend>
						<div>
							<input
								type="radio"
								name="badRatingReason"
								id="notUnderstandable"
								value="NOT UNDERSTANDABLE"
								onChange={this.handleExplanationGiven}
							/>
							<label htmlFor="notUnderstandable">
								<Trans i18nKey="feedback.bad.answer.notUnderstandable">
									Cette page manque de clarté
								</Trans>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="badRatingReason"
								id="notRelevant"
								value="NOT RELEVANT"
								onChange={this.handleExplanationGiven}
							/>
							<label htmlFor="notRelevant">
								<Trans i18nKey="feedback.bad.answer.notRelevant">
									Cette page a un contenu qui ne s'applique pas à ma situation
								</Trans>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="badRatingReason"
								id="poorContent"
								value="POOR CONTENT"
								onChange={this.handleExplanationGiven}
							/>
							<label htmlFor="poorContent">
								<Trans i18nKey="feedback.bad.answer.poorContent">
									Je ne trouve pas ce que je suis venu chercher
								</Trans>
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="badRatingReason"
								id="other"
								onChange={this.handleExplanationGiven}
								value="OTHER"
							/>
							<label htmlFor="other">
								<Trans i18nKey="feedback.bad.answer.other">Autre</Trans>
							</label>
						</div>
						<br />
					</fieldset>
				)}
				{this.state.formStep === 2 && (
					<div>
						<div style={{ textAlign: 'end' }}>
							<button
								onClick={this.handleClose}
								className="ui__ link-button"
								style={{ textDecoration: 'none', marginLeft: '0.3rem' }}
								aria-label="close">
								X
							</button>
						</div>
						<form
							name="feedback"
							style={{ flex: 1 }}
							method="post"
							ref={ref => (this.formRef = ref)}
							onSubmit={this.handleFormSubmit}>
							<input type="hidden" name="form-name" value="feedback" />
							<label htmlFor="message">
								<p>
									<Trans i18nKey="feedback.bad.form.headline">
										Votre retour nous est précieux afin d'améliorer ce site en
										continu. Sur quoi devrions nous travailler afin de mieux
										répondre à vos attentes ?
									</Trans>
								</p>
							</label>
							<textarea
								name="message"
								rows="5"
								style={{ resize: 'none', width: '100%', padding: '0.6rem' }}
							/>
							<br />
							<br />
							<label htmlFor="email">
								<p>
									<Trans i18nKey="feedback.bad.form.email">
										Votre email (si vous souhaitez une réponse de notre part)
									</Trans>
								</p>
							</label>
							<input type="email" name="email" />
							<br />
							<p>
								<button className="ui__ button small" type="submit">
									<Trans>Envoyer</Trans>
								</button>
							</p>
						</form>
					</div>
				)}
			</>
		)
	}
}

export default compose(
	withTracker,
	withRouter
)(FeedbackForm)
