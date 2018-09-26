/* @flow */

import withTracker from 'Components/utils/withTracker'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { compose } from 'redux'
import type { Tracker } from 'Components/utils/withTracker'

type Props = { onEnd: () => void, tracker: Tracker }

class FeedbackForm extends Component<Props> {
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
		this.props.onEnd()
	}

	render() {
		return (
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
		)
	}
}

export default compose(withTracker)(FeedbackForm)
